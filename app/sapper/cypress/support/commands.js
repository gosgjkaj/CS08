// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//


//Set up login value here
export const username = '2'
export const password = '2'


// -- This is a parent command --
Cypress.Commands.add("loginByUI", () => { 
    cy.visit('/login')
    cy.get('input[type=email]').type(username)
    cy.get('input[type=password]').type(password)
    cy.get('button')
        .should('have.class','is-success')
        .click()
    cy.hash().should('eq','')
    cy.contains('You have')
    cy.contains('permission')
})



Cypress.Commands.add("login", () => { 
    cy.request({
        method:'POST',
        url:'http://localhost:3000/login',
        body:{
            email:username,
            password:password
        }
    }).then((resp) => {
        window.localStorage.setItem('jwt', resp.body.user.token)
    })
})
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
