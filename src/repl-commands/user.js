module.exports = function ({ register, CommandRepl, helpfunction }) {
  const user = new CommandRepl('user', helpfunction);
  user.register('info', ([id], client, response) => {
    const user = client.users.find(
      (user) => user.id === id || user.username.toLowerCase().includes(id)
    );
    if (user) {
      const { username, id, mention } = user;
      return response.keyval({ username, id, mention });
    }
    return response(`User with ID [${id}] not found`);
  });
  user.register('account', ([id], client, response) => {
    return response.js(client.profilesManager.getUserAccountData(id));
  });
  user.register('opendota', async ([dotaID], client, response) => {
    const account = await client.profilesManager.getUserAccountData(dotaID); // FIX: use profile manager
    if (account) {
      return client.components.Opendota.request(
        ['https://api.opendota.com/api/players/<id>'],
        account.dota
      ).then(response.object);
    } else {
      return client.components.Opendota.request(
        ['https://api.opendota.com/api/players/<id>'],
        dotaID
      ).then(response.object);
    }
  });
  register(user);
};
