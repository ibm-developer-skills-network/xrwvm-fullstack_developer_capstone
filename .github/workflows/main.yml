name: 'Lint Code'

on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]

jobs:
  lint_python:
    name: Lint Python Files
    runs-on: ubuntu-latest

    steps:

    - name: Checkout Repository
      uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: 3.12

    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install flake8

    - name: Print working directory
      run: pwd

    - name: Run Linter
      run: |
        pwd
        # This command finds all Python files recursively and runs flake8 on them
        find . -name "*.py" -exec flake8 {} +
        echo "Linted all the python files successfully"

  lint_js:
      name: Lint JavaScript Files
      runs-on: ubuntu-latest

      steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 14

      - name: Install JSHint
        run: npm install jshint --global

      - name: Run Linter
        run: |
          # This command finds all JavaScript files recursively and runs JSHint on them
          find ./server/database -name "*.js" -exec jshint {} +
          echo "Linted all the js files successfully"
