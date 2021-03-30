import { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';
import models from './.torenia/models';

const app = dva({
  history: window.g_history,
});

window.g_app = app;

app.use(createLoading());

models.forEach(model => {
  app.model(model);
});

class Container extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default Container;
