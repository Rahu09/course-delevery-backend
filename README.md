# COURSE\\\\\_//DELEVERY

### A fast and easy way to create and sell your course on your own website

LIVE Demo Link - https://course-delevery.onrender.com/

Frontend Repo Link - https://github.com/Rahu09/course-delevery/

## PREVIEW

## TECH STACK USED

- React
- Recoil
- Material UI
- Node.js
- Express
- TypeScript
- Tinymce
- Axios

## SETTING UP LOCALLY

- make a directory in which will contain frontend and backend part of project

```console
  mkdir project
  cd project
```

- now clone the frontend and backend repo in this folder.

```console
  git clone https://github.com/Rahu09/course-delevery-backend.git
  git clone https://github.com/Rahu09/course-delevery.git
```

- install node modules in both directories

```console
  cd course-delevery-backend && yarn install
  cd ..
  cd course-delevery && yarn install
```

- in backend folder setup a .env file which will store the enviournment variable. paste the following values in it.

```console
  MONGODB_URI='<mongodb url>'
  PORT=3005
  ADMINSECRET = 'SecretA'
  USERSECRET = 'SecretB'
```

- in backend folder run -

```console
  yarn build
  yarn start
```

- in frontend folder run -

```console
  yarn dev
```
