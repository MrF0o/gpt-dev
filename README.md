# GPT-dev

generate complete apps with ONE prompt.

The process is simple:
- write the prompt
- run a command
- GPT-dev will ask you if there's anything unclear
- Done! your code is generated

## installation
To install GPT-dev you need nodejs >= 16.0 installed with npm.

first install the package globally to be able to run `gptdev` command from the terminal:

```bash
npm i gpt-dev -g
```

to check that the installation process went correctly run:

```bash
gptdev --help
```
the output should look something like this:

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

## setup OpenAI API Key
GPT-dev looks in enviroment variables for a variable named OPENAI_API_KEY.

if you're on linux you can run this command to set your api key to OPENAI_API_KEY:

```bash
export OPENAI_API_KEY=[your key goes here]
```

if you're on Windows open CMD and use this:

```bat
set OPENAI_API_KEY=[your key goes here]
```

## Usage

after the installation is complete you can now create a project by running this command:
```bash
gptdev create [project name]
```

then, navigate to the newely create folder named [project name] using your terminal and fill in the `./prompt` file.

after the project is created you'll be able to run the generate command:
```bash
gptdev generate --dir="."
```
> `--dir="."` means that the `prompt` file is located in this directory

if everything goes as planned you'll be prompted to answer some question regarding the prompt you provided. after you complete all the answers your files will be generated in the current directory.

[see demo](https://twitter.com/MrF0o/status/1675237396617609228?s=20)

> note this project is still in development and it's not stable, any contribution is welcomed through fathihelmi@outlook.com