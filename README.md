# Travelouge
A travel blogging app
Which help you post about your travelling experiences and helps you find new places to travel
And details of all the great attractions of the place you are travelling

### For contribution create a [issue](https://github.com/madrix01/Travelouge/issues/new)  for env and database secrets

## Welcome to beta [1.0.0]
| CodeBase | Description     |
|----------|-----------------|
| Pizza    | Express backend |
| Fries    | React frontend  | 

### Features and other logs
 - [ ] Basic search feature is deployed advanced search will be deployed later
 - [ ] Feed system is currently being worked on
 - [ ] Major UI changes
 - [X] Map feature is yet to be deployed

## Setting up development environment

### Pre-requisites
- Redis
- yarn
- node
- make
### For backend
- Setup the project and .env
```
cd Pizza
make Pizza
```
- Start firestore emulator
```
make run-emulators
```
- start redis for backend
- start the backend development
```
yarn start
```
### For frontend
- Setup the project and .env
```
cd fries
make fries
```
- Start the project
```
yarn start
