# Habitica Party Progress Info
This tool shows you information on the progress of your party in [Habitica](https://habitica.com/). It covers the pets, quests, potions, equipment and backgrounds. For example, you can use this tool to decide which quest to start next.

### Usage
The tool is hosted using [GitHub Pages](https://pages.github.com/) on a dedicated organisation setup to host tools helping Habiticans.  
Simply follow the [link](https://habitica-tools.github.io/party-progress-info/) and follow the instructions in the tool.

## Acknowledgements

* to the [Habitica](https://habitica.com/) community for helping each other developing good habits

### Author and Maintainers

* this tool was originally created by Pieter ([PieterV](https://bitbucket.org/pietervanh/)) in [this repo](https://bitbucket.org/pietervanh/habitica-tools)
* with his permission Diana ([DAlgma](https://bitbucket.org/dalgma/)) took over this project in October 2021 to improve it further in [her repo](https://bitbucket.org/DAlgma/habitica-tools)
* after some contributions Turac ([ramotar](https://github.com/ramotar)) took over maintenance in November 2025 and moved the project to a [GitHub repo](https://github.com/habitica-tools/party-progress-info)

## Contributing
Feel free to ask questions and leave suggestions in the issues. Forks and pull requests with changes to the tool are also highly welcome!

### Development
This tool is build with
* [Preact](https://preactjs.com/) - as the web framework
* [Mobx](https://mobx.js.org/) - for state management
* [Semantic UI](https://semantic-ui.com) - for the user interface

To start developing, you need to install a current [Node.js](https://nodejs.org/) environment and checkout the repository.

After that, open a shell in the the project directory and run:
```shell
corepack enable
yarn install  
yarn start
```
This starts a local development server, which hosts the tool and updates on any changes you do to the code base.

To make sure your code is properly formatted, run the following command in your shell:
```shell
yarn lint
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
