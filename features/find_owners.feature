Feature: Find Owners
  As a clinic employee
  I want to find owners
  So that I can view and manage their information.

Background:
  Given the following owners exist in the system:
    | id | firstName | lastName  | address      | city      | telephone  |
    | 1  | "George"  | "Franklin"| "110 W. Liberty St." | "Madison" | "6085551023" |
    | 2  | "Betty"   | "Davis"   | "638 Cardinal Ave."  | "Sun Prairie" | "6085551749" |
    | 3  | "Eduardo" | "Rodriquez"| "2693 Commerce St." | "McFarland" | "6085558763" |
    | 4  | "Harold"  | "Davis"   | "563 Friendly St."   | "Windsor"   | "6085553198" |
    | 5  | "Peter"   | "McTavish"| "2387 S. Fair Way"   | "Madison"   | "6085552765" |
    | 6  | "Jean"    | "Coleman" | "105 N. Lake St."    | "Monona"    | "6085552654" |
    | 7  | "Jeff"    | "Black"   | "1450 Oak Blvd."     | "Monona"    | "6085555387" |
    | 8  | "Maria"   | "Escobito"| "345 Maple St."      | "Madison"   | "6085557683" |
    | 9  | "David"   | "Schroeder"| "2749 Blackhawk Trail"| "Madison" | "6085559435" |
    | 10 | "Carlos"  | "Estaban" | "2335 Independence La."| "Waunakee"| "6085555487" |

Scenario: User navigates to the find owners page
  When I navigate to the "Find Owners" page
  Then I should see a form with a "Last name" input field
  Then I should see a "Find Owner" button

Scenario: Find a single owner by last name
  When I search for an owner with the last name "George Franklin"
  Then I should be redirected to the details page for "George Franklin"

Scenario: Find multiple owners by last name
  When I search for an owner with the last name "Davis"
  Then I should see a list of owners with the following names:
    | Name          |
    | "Betty Davis" |
    | "Harold Davis"|

Scenario: Find all owners by providing no last name
  When I search for an owner with an empty last name
  Then I should see a paginated list of all owners

Scenario: Find an owner that does not exist
  When I search for an owner with the last name "UnknownName"
  Then I should see a "not found" message on the "Find Owners" page

Scenario Outline: Search for owners with partial last names
  When I search for an owner with the last name "<partialName>"
  Then I should see a list of owners with the following names:
    | Name                |
    | "<expectedName>"    |

  Examples:
    | partialName | expectedName      |
    | Frank       | George Franklin   |
    | Dav         | Betty Davis       |
    | Dav         | Harold Davis      |

Scenario: Pagination is present when there are more than 5 owners
  When I search for an owner with an empty last name
  Then I should see a list of 5 owners
  And I should see pagination controls

Scenario: Navigating to the next page of owners
  When I search for an owner with an empty last name
  And I navigate to the next page of owners
  Then I should see a list of the next 5 owners

