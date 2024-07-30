![Sample Image](https://github.com/TuringCollegeSubmissions/sbudvy-FE.3/blob/main/public/preview.png)

# Habit tracking application

This is a simple web application designed for tracking your daily habits. Users can add habits and mark them as completed during the day. Main view is divided into to two sections - 7 day navigation and bellow that - habits that user is tracking. The application was built in mind to be used as a phone application hence the narrow focused view in the center. 

## Features

- Adding habits to track
- Users can edit the habits:
  - Rename habits
  - Stop and revoke habits (when stopping, user does not lose the progress made so far, but any further interactions with the habit is stopped)
  - Delete habits (removes all the progress)
- User is not able to mark habits in the future days

## Getting started

1. Clone the repository or download the source code files:

```bash
git clone https://github.com/TuringCollegeSubmissions/sbudvy-FE.3.git
```
2. Install all the packages:

```bash
npm ci
```

## Usage

1. Upon opening the application, click the "Add habit" to add your first habit.
2. You will see 7 checkboxes which are corresponding to the 7 day calendar above.
3. You can click on a habit to see 10 most recent days that the habit has been completed.
4. You can click on a any specific day to see all the habits that are/were completed and not completed in that day.
5. You can navigate through the days to previous weeks, but not to the upcoming. 


Enjoy using the Habit tracking Application to track your important habits!
