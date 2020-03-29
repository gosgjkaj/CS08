const {username} = require('../support/commands.js')
const {password} = require('../support/commands.js')

describe('Main page rendering test(not login)', () => {
	beforeEach(() => {
		cy.visit('/')
	});
    
  it('Have proper navigation bar', () => {
    cy.contains('Home');
    cy.contains('Degrees');
    cy.contains('Courses');
    cy.contains('Students');
  });

  it('Show message to remind user to login', () => {
    cy.visit('/')
    cy.contains('Please log in to access this part of the database');
    cy.visit('/degrees')
    cy.contains('Please log in to access this part of the database');
    cy.visit('/courses')
    cy.contains('Please log in to access this part of the database');
    cy.visit('/students')
    cy.contains('Please log in to access this part of the database');
  });
});



describe('Login function test', () =>{
  
  it('Be able to login', () =>{
    //go to the login page
    cy.visit('/login')
    //assert url
    cy.url().should('include', 'login')
    //fill the form
    cy.get('input[type=email]').type(username)
    cy.get('input[type=password]').type(password)
    //click the login button
    cy.get('button')
      .click()
      .should('have.class','is-success')
    //check if login successfully
    cy.hash().should('eq','')
    cy.contains('You have')
    cy.contains('permission')
  });

  it('Show error message on error login', () =>{
    //go to the login page
    cy.visit('/login')
    //assert url
    cy.url().should('include', 'login')
    //fill the form
    cy.get('input[type=email]').type(username)
    cy.get('input[type=password]').type('Ramdon password')
    //click the login button
    cy.get('button')
      .click()
      .should('have.class','is-success')
    cy.contains('error')   
  });
});






