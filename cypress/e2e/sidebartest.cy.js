describe('template spec', () => {
beforeEach(()=>{
  cy.visit('/login')
  cy.get('[type="email"]').type("demouser@gmail.com")
    cy.get('[type="password"]').type("moonlover35")
    cy.get('button').contains('Login').click()
   
})

it('checks if navbar menu works and navigates properly',()=>{

  // click on the spade image 

cy.get('img[src="https://icon-library.com/images/mining-icon/mining-icon-1.jpg"][alt="logo-image"].w-8.h-8')
.parent('div')
.click()

// click on the navbar menu text to navigate

cy.get('aside').find('ul')
.get('li')
.contains('Coltan')
.parent()
.click()

cy.url().should('include','/coltan')

})

})