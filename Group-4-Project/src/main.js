import {createApp} from 'vue';
import App from './App.vue';
import { createAuth0 } from '@auth0/auth0-vue';

const app = createApp(App);

app.use(
  createAuth0({
    domain: "dev-ruysvqy4bpdwecex.us.auth0.com",
    clientId: "2qHZNfGY51y3EINsaS1Mie6agCKnzLzN",
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: "https://ss9eq95dd7.execute-api.us-east-1.amazonaws.com/Prod/auth"
    }
  })
);

app.mount('#app');