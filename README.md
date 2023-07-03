# GPT-dev

*Imagine, write the prompt and let GPT-dev generate complete apps for you with ONE prompt.*

The process is simple:
- Write the prompt
- Run a command
- GPT-dev will ask you if there's anything unclear
- Done! your code is generated

## Installation
To install GPT-dev you need nodejs version 18.0 or later installed with npm.

First install this package globally to be able to run `gptdev` command from the terminal:

```bash
npm i gpt-dev -g
```

To check that the installation process went correctly, run:

```bash
gptdev --help
```
The output should look something like this:

```txt
Usage: gptdev <command>

Commands:
  gptdev generate [prompt_file]  Generate a project based on a prompt
  gptdev create [project_name]   Bootstrap a new project for GPT-dev
  gptdev                                                               [default]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
      --dir      Output folder                                          [string]
  -k, --key      OpenAI API key                                         [string]
  -v, --verbose  Run with verbose logging                              [boolean]
```

## Setup OpenAI API Key
GPT-dev looks in enviroment variables for a variable named OPENAI_API_KEY.

If you're on linux you can run this command to set your api key to OPENAI_API_KEY:

```bash
export OPENAI_API_KEY=[your key goes here]
```

If you're on Windows open CMD and use this:

```bat
set OPENAI_API_KEY=[your key goes here]
```

## Usage

After the installation is complete you can now create a project by running this command:
```bash
gptdev create [project name]
```

Then, navigate to the newely create folder named [project name] using your terminal and fill in the `./prompt` file.

After you write the prompt you will be able to run the generate command:
```bash
gptdev generate --dir="."
```
> `--dir="."` means that the `prompt` file is located in this directory

If everything went as planned you'll be prompted to answer some question regarding the prompt you provided. after you complete all the answers, your project files will be generated in the current directory.

[see demo](https://twitter.com/MrF0o/status/1675237396617609228?s=20)

> note this project is still in development and it's not stable, any contribution is welcomed through fathihelmi@outlook.com
