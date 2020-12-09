// connection.URL = process.env.API_COMPAPI_GRAPHQLAPIENDPOINTOUTPUT || 'https://333fxhywcffplpt3pesnpzhiwa.appsync-api.ap-southeast-1.amazonaws.com/graphql';
// connection.REGION = process.env.REGION === 'us-east-1-fake' ? 'ap-southeast-1' : process.env.REGION;
// // Connaction Auth
// connection.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'ASIA2DP7X6SIOAMH645W';
// connection.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'Z3gFtIgEVR5/Q3u7jgA1J2kbVnxCA3T94/8lJDVc';
// connection.AWS_SESSION_TOKEN =
//   process.env.AWS_SESSION_TOKEN ||
//   // eslint-disable-next-line max-len
//   'IQoJb3JpZ2luX2VjEEgaDmFwLXNvdXRoZWFzdC0xIkgwRgIhAMVi9w/XbOIapWxJZX8wOcD/g6KIhv6Rh2a7TeVfhGVIAiEA/RE/Xi+eOhXrovboJ7Vwtj2r5+6ST38JGZfScp1v0eAq0wEIYRAAGgw2OTQ3MTA0MzI5MTIiDIvIgR2t+NbfJEIlCyqwAbl3oskV4lxxAdJdMaX8/Y8+rLt9BPL+dWaC/o3kSGUIbCYof7zK0uA3byxRtgvBPz5RDFe090FP+nd6zoIWE4XHlANiFLhoNKRs/rthFLjq+kQs+wK/iOgxuwPsR1sab9rNYVVYCS/f2oHbQ7iKbSAfpZ7Ger80towga9zE2UX38LA33qc25S/6I1FBjPbyqUuUCK8ig+pMUncRWnpqobGI8MVi4iCzpGHMoiZKvv3wMI6BnvsFOt8BbxjYnEbqWZ9lxwSkBNi00c9Vzkg0y+XqWnCcunFsRzCYin4n1dY4ibhYKRrIf78Z+/NKVGhcBslsDa75khrANg79kzGuLjHXggiAIiDX/LUGma52CJQBJN8138640AM7XO8EiVorQIL8B6LwC6gRbbAlzFbHFTEdhjz+D4psgy0ziIMVxT3r6KQmQm5w1Z9UWVrlksf/ivv3H1iBJe8soLj5clJB2Fs0lx+7znSXbL99jUuAowvD4NWI8Qlg3eVd595PqIoobGZqEKdAajRWXTBfa+u6ypF1W4hxEfOKmw==';

interface Connection {
  URL: string;
  REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_SESSION_TOKEN: string;
}

export default Connection;
