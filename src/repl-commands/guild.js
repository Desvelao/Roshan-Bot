module.exports = function ({ register, CommandRepl, helpfunction }) {
  const guild = new CommandRepl('guild', helpfunction);
  guild.register('list', (_, client, response) =>
    response.table(
      ['ID', 'Name', 'Members'],
      client.guilds.map((g) => [g.id, g.name, g.memberCount])
    )
  );
  guild.register('info', ([id], client, response) => {
    const guild = client.guilds.find(
      (g) => g.id === id || g.name.toLowerCase().includes(id)
    );
    if (guild) {
      const { name, memberCount, id } = guild;
      return response.keyval({ id, name, memberCount });
    }
    return response(`Guild with ID [${id}] not found`);
  });
  register(guild);
};
