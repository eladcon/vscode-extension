import * as vscode from 'vscode';
const axios = require('axios');
const yaml2 = require('js-yaml');
import { getFlag, shouldHover } from './javascript';
import { FlagResult } from './flagResult';
const Rox = require('rox-node');

interface App {
	id: string;
}
interface Environment {
	id: string;
	name: string;
}
interface Experiment {
	flag: string;
	environment: string;
	appId: string;
	platforms: [{
		flag: string
	}];
}

const baseURL = 'https://x-api.rollout.io/public-api/applications';

const start = async () => {
	const container = {
		fetchIntervalMS: new Rox.Variant('60000')
	};
	Rox.register('', container);
	await Rox.setup("5d8a0f05e0455c42be5ba92a");

	await fetchData();

	const startTimer = async () => {
		setTimeout(async () => {
			try {
				await fetchData();
			} finally {
				startTimer();
			}
		}, parseInt(container.fetchIntervalMS.getValue()));
	};

	startTimer();
};

let allExps : Array<Experiment> = [];

const fetchData = async () => {
	const apiToken = vscode.workspace.getConfiguration().get('conf.rollout.apiToken');
	if (!apiToken) {
		console.log('rollout extension: no api token');
		return;
	}
	const appFromConf = vscode.workspace.getConfiguration().get('conf.rollout.appId');
	const envFromConf = vscode.workspace.getConfiguration().get('conf.rollout.environmentName');

	const headers = {
		headers: {
			Authorization: `Bearer ${apiToken}`,
			accept: 'application/json'
		}
	};
	const apps = appFromConf ? { data: [{ id: appFromConf }] } : await axios.get(baseURL, headers);
	const exps : Array<Array<Experiment>> = await Promise.all(apps.data.map(async (a : App) => {
		const envs = envFromConf ? { data: [{ name: envFromConf }] } : await axios.get(`${baseURL}/${a.id}/environments`, headers);
		const exps : Array<Array<Experiment>> = await Promise.all(envs.data.map(async (e : Environment) => {
			const exps = await axios.get(`${baseURL}/${a.id}/${e.name}/experiments`, headers);
			return exps.data.map((exp : Experiment) => {
				exp.environment = e.name;
				exp.appId = a.id;
				return exp;
			});
		}));
		return exps.reduce((all, curr) => all.concat(curr), []);
	}));
	allExps = exps.reduce((all, curr) => all.concat(curr), []);
};

export function activate(context: vscode.ExtensionContext) {
	console.log('rollout extension activated');

	start();

	let hoverProvider : vscode.HoverProvider = {
		provideHover(document, position, token) {
			const line = document.lineAt(position);
			let flagResult = getFlag(line.text);
			if (flagResult && flagResult.name) {
				const flagIncludes = (flagName: string, flagResult: FlagResult) => {
					if (flagResult.isDynamicAPI) {
						return flagName === flagResult.name;
					} else {
						return flagName.includes(flagResult.name!);
					}
				};
				const exps = allExps.filter(e => e.flag ? flagIncludes(e.flag, flagResult!) : e.platforms.find(p => flagIncludes(p.flag, flagResult!)));
				if (!exps || !exps.length) {
					return;
				}

				const useLineForHover = vscode.workspace.getConfiguration().get('conf.rollout.useLineForHover');
				const hoverToken = document.getText(document.getWordRangeAtPosition(position));
				const showHover = !!useLineForHover || shouldHover(hoverToken, flagResult);
				if (!showHover) {
					return;
				}

				const markdown = new vscode.MarkdownString();
				markdown.appendMarkdown(`### Rollout\n`);
				exps.forEach(e => {
					markdown.appendMarkdown(`### ${e.environment} (https://app.rollout.io/app/${e.appId})`);
					const ue = Object.assign({}, e);
					delete ue.environment;
					delete ue.appId;
					markdown.appendCodeblock(`${yaml2.safeDump(ue)}`);
				});
				return new vscode.Hover(markdown);
			}
		}
	};

	vscode.languages.registerHoverProvider('typescript', hoverProvider);
	vscode.languages.registerHoverProvider('javascript', hoverProvider);
}

export function deactivate() {}
