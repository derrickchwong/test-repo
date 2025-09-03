Feature: View Owner's Pets
  As a user of the Pet Clinic system
  I want to view the details of a specific owner
  So that I can see a comprehensive list of all their pets, including each pet's name, birth date, and type.

Background:
  Given the following pet types exist in the system:
    | name      |
    | cat       |
    | dog       |
    | lizard    |
    | snake     |
    | bird      |
    | hamster   |
  And the following owners and their pets are registered in the system:
    | owner_name        | address           | city      | telephone   | pet_name | birth_date | pet_type |
    | "George Franklin" | "110 W. Liberty St." | "Madison" | "6085551023" | "Leo"    | "2010-09-07" | "cat"    |
    | "Betty Davis"     | "638 Cardinal Ave."  | "Sun Prairie" | "6085551749" | "Basil"  | "2012-08-06" | "hamster"|
    | "Eduardo Rodriquez" | "2693 Commerce St."  | "McFarland" | "6085558763" | "Rosy"   | "2011-04-17" | "dog"    |
    | "Eduardo Rodriquez" | "2693 Commerce St."  | "McFarland" | "6085558763" | "Jewel"  | "2010-03-07" | "dog"    |
    | "Harold Davis"    | "563 Friendly St."   | "Windsor" | "6085553198" | "Iggy"   | "2010-11-30" | "lizard" |
    | "Peter McTavish"  | "2387 S. Fair Way"   | "Madison" | "6085552765" | "George" | "2010-01-20" | "snake"  |
    | "Jean Coleman"    | "105 N. Lake St."    | "Monona"  | "6085552654" | "Samantha" | "2012-09-04" | "cat"    |
    | "Jean Coleman"    | "105 N. Lake St."    | "Monona"  | "6085552654" | "Max"    | "2012-09-04" | "cat"    |
    | "Jeff Black"      | "1450 Oak Blvd."     | "Monona"  | "6085555387" |          |            |          |
    | "Maria Escobito"  | "345 Maple St."      | "Madison" | "6085557683" | "Mulligan" | "2011-02-24" | "dog"    |

Scenario: Viewing an owner who has a single pet
  When I view the details for the owner "George Franklin"
  Then I should see the owner's name "George Franklin"
  And I should see the owner's address "110 W. Liberty St."
  And I should see the owner's city "Madison"
  And I should see the owner's telephone number "6085551023"
  And I should see a list of pets containing exactly 1 entry
  And the pet list should contain the following details:
    | Name | Birth Date | Type |
    | "Leo"  | "2010-09-07" | "cat"  |

Scenario: Viewing an owner who has multiple pets
  When I view the details for the owner "Jean Coleman"
  Then I should see the owner's name "Jean Coleman"
  And I should see a list of pets containing exactly 2 entries
  And the pet list should contain the following details in alphabetical order of the pet's name:
    | Name       | Birth Date | Type |
    | "Max"      | "2012-09-04" | "cat"  |
    | "Samantha" | "2012-09-04" | "cat"  |

Scenario: Viewing an owner who has no pets
  When I view the details for the owner "Jeff Black"
  Then I should see the owner's name "Jeff Black"
  And the pet list should be empty
  And I should see a message indicating there are no pets for this owner

Scenario Outline: Pet details are displayed correctly for various owners and pets
  When I view the details for the owner "<owner_name>"
  Then I should see a pet in the list with the name "<pet_name>", birth date "<birth_date>", and type "<pet_type>"

  Examples:
    | owner_name          | pet_name   | birth_date | pet_type | notes                               |
    | Betty Davis       | Basil    | 2012-08-06 | hamster  | Verifies hamster type             |
    | Eduardo Rodriquez | Rosy     | 2011-04-17 | dog      | Verifies dog type                 |
    | Harold Davis    | Iggy     | 2010-11-30 | lizard   | Verifies lizard type              |
    | Peter McTavish  | George | 2010-01-20 | snake    | Verifies snake type               |
    | Maria Escobito  | Mulligan | 2011-02-24 | dog      | Another dog to ensure no mix-ups  |
