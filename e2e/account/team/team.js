module.exports = {
  'Add new team': function (client) {
    client
      .url(`${client.launchUrl}test-organization-cannot-delete/test-tournament-cannot-delete`)
      .waitForElementVisible('body', 1000)
      .useXpath()
      .click("//*[contains(text(), 'Manage')]")
      .click("//*[contains(text(), 'Teams')]")
      .assert.title('Go Champs! | Test tournament (cannot delete)')
      .useCss()
      .click('a[href="/test-organization-cannot-delete/test-tournament-cannot-delete/NewTeam"]')
      .pause(1000)
      .setValue('input[name="name"]', 'Test team (can delete)')
      .pause(1000)
      .click('button[type=submit]')
      .assert.containsText('.notification', 'Test team (can delete) created!')
      .end();
  },

  'Edit team': function (client) {
    client
    .url(`${client.launchUrl}test-organization-cannot-delete/test-tournament-cannot-delete`)
      .waitForElementVisible('body', 1000)
      .useXpath()
      .click("//*[contains(text(), 'Manage')]")
      .click("//*[contains(text(), 'Teams')]")
      .click("//*[contains(text(), 'Test team (can delete)')]")
      .useCss()
      .pause(1000)
      .setValue('input[name="name"]', ' edited')
      .pause(1000)
      .click('button[type=submit]')
      .assert.containsText('.notification', 'Test team (can delete) edited updated!')
      .end();
  },

  'Delete team': function (client) {
    client
      .url(`${client.launchUrl}test-organization-cannot-delete/test-tournament-cannot-delete`)
      .waitForElementVisible('body', 1000)
      .useXpath()
      .click("//*[contains(text(), 'Manage')]")
      .click("//*[contains(text(), 'Teams')]")
      .click("//*[contains(text(), 'Test team (can delete) edited')]/../../div/button")
      .useCss()
      .assert.containsText('.notification', 'Test team (can delete) edited deleted!')
      .end();
  }
}