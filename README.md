# table-pathfinder
## Description
table-pathfinder is an app that stores user inputed schema's and join rules for many tables and produces the SQL join statements to link selected tables columns together. Pathfinder will take two unrelated tables, and run through a known path to link as many tables as it takes to make the join possible. This app is made so I don't have to double check all my table schemas every time I need to pull data and it's doubly troubly when I have missmatching column names.


The app will store user data in side data.txt. This file is already a part of the .gitignore for privacy reasons. If the app ships with a demo table, it will be held in an alternate file.