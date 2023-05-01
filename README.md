
## 🛠 Install

Clone this repository:

```bash
git clone https://github.com/zuzaluorg/zuzalu.git
```

And install the dependencies:

```bash
cd web-app && yarn
cd apps/web-app && yarn
```

## 📜 Usage

Web app needs its env variables. Copy the `.env.example` file as `.env.local` at the `apps/web-app` folder.

```bash
cp .env.example .env.local
```

And add your environment variables.

### Start the web-app

Run the following command to run a local web app from your apps folder:

```bash
yarn start:web-app
```

### Code quality and formatting

Run [ESLint](https://eslint.org/) to analyze the code and catch bugs:

```bash
yarn lint
```

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn prettier
```

or to automatically format the code:

```bash
yarn prettier:write
```
