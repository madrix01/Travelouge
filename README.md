# Travelouge

A travel blogging app
Which help you post about your travelling experiences and helps you find new places to travel
And details of all the great attractions of the place you are travelling

### For contribution create a [issue](https://github.com/madrix01/Travelouge/issues/new) for env and database secrets

## Welcome to beta [1.0.0]

| CodeBase | Description     |
| -------- | --------------- |
| Pizza    | Express backend |
| Fries    | React frontend  |

## Setting up development environment

### Prerequisites

- Docker
- Docker-compose
- Typescript compiler (tsc)

### Setting up

- Fork the project

```bash
git clone https://github.com/<Your Username>/Travelouge
cd Travelouge/
cd Pizza/
cp env.example .env
npx prisma migrate dev --name init #migrated schema to data
docker-compose up # This starts the backend server
```

> Any change with the docker-compose file should be discussed at the discord chat

- All the files changes will sync with the nodemon
- Any problem with docker should be reported in the [issue](https://github.com/madrix01/Travelouge/issues/new)
- while editing the files don't forget to start the Typescript compiler
