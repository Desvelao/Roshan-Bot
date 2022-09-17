module.exports = {
  name: 'unregister',
  category : 'Account',
  help : "Delete your Roshan's account",
  args : '',
  requirements: ['account.exist'],
  run: async function (msg, args, client, command){
    return client.components.Account.deleteProcess(args.account._id, msg)
  }
}
