 Angular Table with Multiple Features


Requirements:
1. The table should be created using Angular components and directives.
-> Splitted solution into presentational and container components

2. The table receives the columns and the data as Input.
-> Settings up @Input properties and handing over data via data-binding

3. The table should fetch data from an API and display it in the table.
-> Created two central services for data and passing it to the presentational component

4. The table should support sorting by clicking on column headers.
-> Click event on the column header changes the filter state which results in new data

5. The table should support filtering by a search term entered by the user.
-> Input field added. Changes on the field will result in an updated state.

6. The table should support pagination to display a limited number of rows at a time.
-> Setting up @Input property. Filtering data when page is changed. Calculation maxpages depending on data and maxitems.

7. The table should allow users to edit and update data directly from the table.
-> Make data via html editable. Making track of changes happening to the ui and persistet new data.
ToDo: Create Eventemitter to inform container components about the changed data

8. The table should be configurable to work with different datasets and column
configurations.
-> Creating everything flexible.

9. (Nice to have) The table should support drag and drop to reorder rows.
-> Skiped

10. (Nice to have) The table should allow users to reorder and resize columns.
-> Skiped


To run the solution you need the following:

- Install nodejs
- Run "npm install"
- Run "npm install -g @angular/cli"
- Run "npm start"