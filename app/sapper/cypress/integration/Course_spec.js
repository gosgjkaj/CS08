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

  it('can nav to the proper page', () => {
    cy.visit('/courses')
    cy.url().should('include','/')
  });
});



describe('Login function test', () =>{
  it('login page shows', () =>{
    cy.visit('/login')
    cy.url().should('include', 'login')
  });

  it('Be able to login', () =>{
    cy.visit('/login')
    cy.url().should('include', 'login')
    cy.get('input[type=email]').type(username)
    cy.get('input[type=password]').type(password)
    cy.get('button')
      .click()
      .should('have.class','is-success')
    cy.hash().should('eq','')
    cy.contains('You have')
    cy.contains('permission')
  });

  it('Show waiting progress on error login', () =>{
    cy.visit('/login')
    cy.url().should('include', 'login')
    cy.get('input[type=email]').type(username)
    cy.get('input[type=password]').type('Ramdon password')
    cy.get('button')
      .click()
      .should('have.class','is-success')
  });
});



context('Course page test', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/courses') 
    });

    it('has search bar', function ()  {
      cy.get('input').should('have.class','input')
    });

    it('information when there is no course', function ()  {
      cy.get('p')
    });
  
    it('Add Course button works', function ()  {
      cy.get('a[href*="javascript:;"]').should('have.class','is-success').eq(1).click()
      cy.contains('Add New Course')
      cy.get('input').should('have.class','input').eq(1).type('test',{ force: true })
      cy.get('select').eq(2).select('Third',{ force: true }).contains('Third')
      cy.get('div').eq(67).click({ force: true })
      cy.get('div').eq(69).click({ force: true })
      cy.get('input').eq(4).type('test',{ force: true })
      cy.get('textarea').type('test',{ force: true })
      cy.get('button').eq(6).click({ force: true })
    });

    it('show the proper listing page', function ()  {
      cy.login()
      cy.visit('/courses') 
      cy.get('div')
      cy.contains('Course')
    });
});

context('Admin page test', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/admin') 
  });

  it('nav to admin page', function ()  {
    cy.url().should('include','/')
  });

  it('require name', function ()  {
    cy.contains('Name')
  });
  it('require email', function ()  {
    cy.contains('Email')
  });
  it('can select role', function ()  {
    cy.contains('Role')
  });
  it('require password', function ()  {
    cy.contains('Password')
  });
  it('require to comfirm password', function ()  {
    cy.get('label').eq(4).click()
  });
  it('require password', function ()  {
    cy.get('button').eq(5).contains('Register')
  });

  it('require to comfirm password', function ()  {
    cy.get('input').eq(0).type('test')
    cy.get('input').eq(1).type('test')
    cy.get('input').eq(2).type('test')
    cy.get('input').eq(3).type('test')
    cy.get('input').eq(4).type('test')
    cy.get('button').eq(5).click()
  });

  it('shows proper admin list', function ()  {
    cy.get('div').eq(28).children().eq(1).contains('Loading users')
  });
});

