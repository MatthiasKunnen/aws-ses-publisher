import * as fs from 'fs';

import {ArgumentParser} from 'argparse';
import {oneLine} from 'common-tags';

import {AwsSesPublisher} from './index';

const parser = new ArgumentParser({
    description: 'Publish email templates to Amazon SES.',
});

parser.addArgument('--config-file', {
    defaultValue: 'templates.json',
    dest: 'configFile',
    help: 'The json file containing the templates\' ID, subject, ... Default templates.json',
    metavar: 'Config file',
});

parser.addArgument('--only', {
    dest: 'only',
    help: 'Only upload the specified templates. If not specified, all templates will be deployed',
    metavar: 'template-id',
    nargs: '+',
});

parser.addArgument('--template-dir', {
    dest: 'templateDir',
    help: 'The directory to find the templates in.',
    metavar: 'Template directory',
    required: true,
});

parser.addArgument('--suffix', {
    dest: 'suffix',
    help: oneLine`
        Specify a suffix for your template names. This can be useful for deploying test versions.
        E.g. PasswordReset with suffix Review would become PasswordResetReview.
    `,
    metavar: 'review/beta/test/...',
});

parser.addArgument(['-v', '--verbose'], {
    action: 'storeTrue',
    defaultValue: false,
    dest: 'verbose',
    help: 'Print more info.',
});

interface Args {
    configFile: string;
    only: Array<string> | null;
    suffix: string | null;
    templateDir: string;
    verbose: boolean;
}

let argv = process.argv;

if (argv[1].startsWith('/')) {
    argv = argv.slice(2);
}

const args: Args = parser.parseArgs(argv);
const templateConfig = JSON.parse(fs.readFileSync(args.configFile, 'utf8'));
const publisher = new AwsSesPublisher({
    only: args.only ?? undefined,
    suffix: args.suffix ?? undefined,
    templateConfig,
    templateDir: args.templateDir,
    verbose: args.verbose,
});

publisher.publishEmailsWithConfig().catch(console.error);
