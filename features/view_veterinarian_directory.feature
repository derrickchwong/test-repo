Feature: View Veterinarian Directory (HTML)
  As a user of the Pet Clinic website
  I want to view a list of all veterinarians and their specialties
  So that I can find the right veterinarian for my pet's needs.

Background:
  Given the following veterinarians exist in the system:
    | firstName | lastName  | specialties        |
    | "James"   | "Carter"  | "radiology"        |
    | "Helen"   | "Leary"   | "dentistry"        |
    | "Linda"   | "Douglas" | "surgery", "dentistry" |
    | "Rafael"  | "Ortega"  | "surgery"          |
    | "Henry"   | "Stevens" |                    |
    | "Sharon"  | "Jenkins" | "radiology"        |

Scenario: Viewing the first page of the veterinarian directory
  When a user views the veterinarian directory
  Then the page title should be "Veterinarians"
  And the following veterinarians should be listed in order:
    | Name               | Specialties          |
    | "James Carter"     | "radiology"          |
    | "Helen Leary"      | "dentistry"          |
    | "Linda Douglas"    | "surgery dentistry"  |
    | "Rafael Ortega"    | "surgery"            |
    | "Henry Stevens"    | "none"               |
  And the pagination control should show that this is page "1" of "2"

Scenario: Navigating to the second page of the veterinarian directory
  When a user navigates to page "2" of the veterinarian directory
  Then the following veterinarians should be listed in order:
    | Name              | Specialties |
    | "Sharon Jenkins"  | "radiology" |
  And the pagination control should show that this is page "2" of "2"

Scenario: No veterinarians are available
  Given there are no veterinarians in the system
  When a user views the veterinarian directory
  Then the veterinarian list should be empty
  And no pagination controls should be visible

Scenario Outline: Viewing the veterinarian directory in different data formats
  When a user requests the veterinarian list in <Format> format
  Then a <ContentType> response should be returned
  And the response should contain the complete list of all 6 veterinarians

  Examples:
    | Format | ContentType      |
    | "JSON" | "application/json" |
    | "XML"  | "application/xml"  |