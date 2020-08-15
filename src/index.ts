import * as fs from 'fs';
import * as path from 'path';

import {
    CreateTemplateCommand,
    SESClient,
    Template,
    UpdateTemplateCommand,
} from '@aws-sdk/client-ses';

export interface TemplateConfig {
    html?: string;
    subject: string;
    text?: string;
}

export interface PublishEmailsInput {
    templateDir: string;
    suffix?: string;
    templateConfig: {[k: string]: TemplateConfig};
    only?: Array<string>;
    verbose: boolean;
}

export async function publishEmails(templates: Array<Template>, verbose = false): Promise<void> {
    const sesClient = new SESClient({});

    for (const template of templates) {
        try {
            if (verbose) {
                console.log(`Updating ${template.TemplateName}`);
            }

            await sesClient.send(new UpdateTemplateCommand({
                Template: template,
            }));
        } catch (e) {
            if (e.Code !== 'TemplateDoesNotExist') {
                throw e;
            }

            if (verbose) {
                console.log(`${template.TemplateName} does not yet exist, creating...`);
            }

            await sesClient.send(new CreateTemplateCommand({
                Template: template,
            }));
        }
    }
}

export class AwsSesPublisher {

    suffix: string;
    templateConfig: {[k: string]: TemplateConfig};
    templateDir: string;
    templateNames: Array<string>;
    verbose: boolean;

    constructor(input: PublishEmailsInput) {
        this.templateNames = input.only ?? Object.keys(input.templateConfig);
        this.suffix = input.suffix ?? '';
        this.templateConfig = input.templateConfig;
        this.templateDir = input.templateDir;
        this.verbose = input.verbose;
    }

    async publishEmailsWithConfig(): Promise<void> {
        const templates = this.templateNames.map(templateName => {
            const templateConfig = this.templateConfig[templateName];

            return {
                HtmlPart: this.readTemplateFile(templateConfig.html),
                SubjectPart: templateConfig.subject,
                TemplateName: templateName + this.suffix,
                TextPart: this.readTemplateFile(templateConfig.text),
            };
        });

        await publishEmails(templates, this.verbose);
    }

    private readTemplateFile(filename?: string): string {
        if (filename === undefined) {
            return '';
        }

        const absolutePath = path.join(this.templateDir, filename);

        return fs.readFileSync(absolutePath, 'utf8');
    }
}
