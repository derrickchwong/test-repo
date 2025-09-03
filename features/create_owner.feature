Feature: Create New Owner
  As a clinic employee
  I want to add a new owner to the system
  So that I can keep track of patient and client information.

Background:
  Given I am on the new owner creation page

Scenario: Successfully create a new owner with valid information
  When I fill in the owner form with the following valid information:
    | First Name | George |
    | Last Name  | Franklin |
    | Address    | 110 W. Liberty St. |
    | City       | Madison |
    | Telephone  | 6085551023 |
  And I click the "Add Owner" button
  Then I should be redirected to the details page for the new owner
  And the owner's details should be displayed as follows:
    | Name       | George Franklin |
    | Address    | 110 W. Liberty St. |
    | City       | Madison |
    | Telephone  | 6085551023 |

Scenario Outline: First name is a required field
  When I leave the <field> field blank and fill in the rest of the owner form with valid information
  And I click the "Add Owner" button
  Then I should see an error message indicating that the first name is required
  And I should remain on the new owner creation page

  Examples:
    | field       |
    | First Name  |

Scenario Outline: Last name is a required field
  When I leave the <field> field blank and fill in the rest of the owner form with valid information
  And I click the "Add Owner" button
  Then I should see an error message indicating that the last name is required
  And I should remain on the new owner creation page

  Examples:
    | field       |
    | Last Name   |

Scenario Outline: Address is a required field
  When I leave the <field> field blank and fill in the rest of the owner form with valid information
  And I click the "Add Owner" button
  Then I should see an error message indicating that the address is required
  And I should remain on the new owner creation page

  Examples:
    | field       |
    | Address     |

Scenario Outline: City is a required field
  When I leave the <field> field blank and fill in the rest of the owner form with valid information
  And I click the "Add Owner" button
  Then I should see an error message indicating that the city is required
  And I should remain on the new owner creation page

  Examples:
    | field       |
    | City        |

Scenario Outline: Telephone is a required field
  When I leave the <field> field blank and fill in the rest of the owner form with valid information
  And I click the "Add Owner" button
  Then I should see an error message indicating that the telephone is required
  And I should remain on the new owner creation page

  Examples:
    | field       |
    | Telephone   |

Scenario Outline: Telephone must be a number
  When I fill in the telephone field with "<invalid_telephone>" and fill in the rest of the owner form with valid information
  And I click the "Add Owner" button
  Then I should see an error message indicating that the telephone must be a number
  And I should remain on the new owner creation page

  Examples:
    | invalid_telephone |
    | "not-a-number"    |
    | "123-456-7890"    |
    | "123 456 7890"    |

Scenario Outline: Telephone must not exceed 10 digits
  When I fill in the telephone field with "<invalid_telephone>" and fill in the rest of the owner form with valid information
  And I click the "Add Owner" button
  Then I should see an error message indicating that the telephone must be 10 digits or less
  And I should remain on the new owner creation page

  Examples:
    | invalid_telephone |
    | "12345678901"     |
    | "98765432109"     |