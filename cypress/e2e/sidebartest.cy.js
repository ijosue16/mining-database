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

cy.get('button').contains('Add new Entry').click()
cy.get('[type="text"]').eq(1).type('DEMIKARU')
cy.get('[type="text"]').eq(2).type('demikaru@gmail.com')
cy.get('[type="text"]').eq(3).type('20231457')
cy.get('[type="text"]').eq(4).type('Nkumbuye eden')
cy.get('[type="text"]').eq(5).type('20021300587410')
cy.get('[type="text"]').eq(6).type('+250785478696')

})

})