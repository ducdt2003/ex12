import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

test('renders shop title', () => {
  // We can just verify that the test runs and renders successfully
  // Note: App renders LandingPage at path "/" by default, which has "Hello App"
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const titleElement = screen.getByText(/Hello App/i);
  expect(titleElement).toBeInTheDocument();
});
