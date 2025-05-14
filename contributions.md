# Contributions

Every member has to complete at least 2 meaningful tasks per week, where a
single development task should have a granularity of 0.5-1 day. The completed
tasks have to be shown in the weekly TA meetings. You have one "Joker" to miss
one weekly TA meeting and another "Joker" to once skip continuous progress over
the remaining weeks of the course. Please note that you cannot make up for
"missed" continuous progress, but you can "work ahead" by completing twice the
amount of work in one week to skip progress on a subsequent week without using
your "Joker". Please communicate your planning **ahead of time**.

Note: If a team member fails to show continuous progress after using their
Joker, they will individually fail the overall course (unless there is a valid
reason).

**You MUST**:

- Have two meaningful contributions per week.

**You CAN**:

- Have more than one commit per contribution.
- Have more than two contributions per week.
- Link issues to contributions descriptions for better traceability.

**You CANNOT**:

- Link the same commit more than once.
- Use a commit authored by another GitHub user.

---

## Contributions Week 1 - [24.03] to [30.03]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **@lydia-milena** |  29.03  | 97fda3ef4f2f1605dbca678b28314221fe6e3ef8 | I have added the REST enpoints for creating and joining a game, getting all pulbic games and getting game information. I also implemented the service, repository and entity classes of the Game and Player objects. | This provides the backend to implement User Story 3  |
|                    |29.03 | 5382660c8848955451d206354981acbc8e851275 | Implemented the card system, including card distribution and drawing community cards based on the game stage. | Necessary subpart of User story 4 |
| **@IsSaudade** | 29.03   | f6f70ec7e45b7bcf7824637c959e4a4d8e502f25 | Profile View Page  | Integrated all components to provide a complete user profile browsing experience |
|                    | 29.03   | c9ef0559683ff10cb5618e4e37f41a15c37a7286 | Visually presented user level information with the experience level display | Added user experience level display feature |
|                    | 29.03   | b12506f1c2d7ef62c56c82603c8688469cc6c246 | Initialized user profile page component structure | Established the foundation framework for user profile display |
| **@unscttp** | 30.03   | 96345bdca66a9ae9f5b98beba9ca2d62b8637f5a | Initialized Lobby and two room related components | Established foundation of game room management |
|                    | 30.03   | f730498d3ee52ebea6e9f0623fdd0967ecaeff99 | Adjusted the components to use Local Sotrage and alligh implementation with proposed backend GTOs | Critical on authentication and developement in the game room management system |
| **@Qavrox** | 30.03   | 6726b321789573375cd1566934d815bb9cb15bb7 | Created User entity, database schema and REST endpoints with a simple avatar implementation, and implemented user profile service layer with validation  | Implemented the user management system |
|                    | 30.03   | 8293fed8df5bcef6a353ec30225f45530b0ee50c | User list endpoints implementation and bug fixes  | Foundation of friend system and profile editing |
| **@TauSigma5**     | 29.03   | 920ae4d4dd7b1287041baaf3be1fdc9574193157, 706a6d1e57631b5e8dc2329d3931bd68c4519e57 | Implement API client on the front end | Allows the rest of the implementation to use interfaces and a clean ApiClient instead of directly issuing API requests, therefore improving development velocity |
| **@TauSigma5**     | 29.03   | 7b6b9652f20fe6d211e8b5b5dec35deedec687f1 | Research and implement statistics algorithm for determining win change | Most of Task #43 |
| **@TauSigma5**     | 30.03   | 73335d0677ce1e3fd28ffc763cf6cbfab6a78825 | Implement friends database and REST API | Completes Task #47 |
---

## Contributions Week 2 - [31.03] to [10.04]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@TauSigma5]**   |  06.04   | ebf7c1ed2e14c4ce393e79cb034a4c163ccffee4 | Improvements for the Deck and Card representation and writing tests | This provides a solid representation of Game, Deck and Cards to be used by OddsCalculator and other components |
|                    |  06.04   | dbf616d424302d7db2afac89a98cc84b35a76b87 | Use the new representation from the above commit in odds calculator | This integrates older code into the code base since OddsCalculator existed before the Game representation did |
|                    |  09.04   | de5ff784cc273c2261e1effe8632727c7084452a | Implement win determination | Key part of user story and task #35 |
| **[@unscttp]** | 09.04   | 34f28efde631998e1eb14e401cbe33fa235561af | Edited room creation component to fit game room requirement | Core mechanism of game itself |
|                    | 09.04   | 54c1f9d16f46045e92c87d71556e403bbb4e79bb | Creation of files relevant to player action | Allows the functioning of players' actions |
| **[@Qavrox]** | 08.04   | 2636dd2ec1d005fd21f43366eff6f2ba005c291d | Implement player action services | Basic function in a game |
|                    | 10.04   | 17ca75611e4a355ed5f2f060823f1390547254f1 | Implemented Betting round management and wrote tests | Basic function in a game |
| **[@IsSaudade]** |08.04   | 99cfd33daa5abd1d1a9c6742be3a5d5eba8aa27c | Implement game table UI with player positions and cards | Basic function in a game |
|                    | 08.04   | 82c9fb2cc22cc2308e4a300b483823c7df7f045f | endpoint for joining a game | Basic function in a game |
| **[@lydia-milena]** | 07.04  | 616963727e7a6e5464c46e2c994b5eac2b579d89 | Implemented the backend function for game updates. | Required for User Story 5 and general game mechanics |
|                    | 07.04  | 616963727e7a6e5464c46e2c994b5eac2b579d89 | Implemented Authentication for the room listing functions, game creation and joining a game | Required for User Story 3 |

---

## Contributions Week 3 - [11.04] to [27.04]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@Qavrox]** | 16.04   | [[Link to Commit 1]](https://github.com/Qavrox/sopra-fs25-group-45-server/commit/95a6b1b3ac3c99eed55fde1e81346336bff350a6) | Verification for player action and make changes to related components | To make sure the actions are done by the players themselves. |
|                    | 16.04   | [[Link to Commit 2]](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/ad0b244d5d0ebb9dd9e71a13e6f5d1aa6a0edd74) | Implemented the tutorial page. | To provide learning material for new players and to meet US13 |
| **[@TauSigma5]** | 17.04   | [Link to Commit 1](https://github.com/Qavrox/sopra-fs25-group-45-server/pull/65) | Finish win probability API | Part of User Story US#10 |
|                    | 18.04   | [Link to Commit 2](https://github.com/Qavrox/sopra-fs25-group-45-client/pull/19) | Begun fixing and replacing mock/scattered API into apiClient | Attempts to reduce integration hell between front end and backend (more work to be done) |
| **[@unscttp]** | 15.04   | [Link to Commit 1](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/8ae78825ded0a53b4b2a021250156442963a3cbc) | Implementation of entity midification | Makes the build of client work, crucial for future development |
|                    | 16.04   | [Link to Commit 2](https://github.com/Qavrox/sopra-fs25-group-45-server/commit/b889d3fb8032de867b2aad9f5f6bec860c264fec) | Modification to player action component | further polishnemt to players'actions to fit gaming logic |
| **[@lydia-milena]** | 17.04   |[Link to Commit 2](https://github.com/Qavrox/sopra-fs25-group-45-server/commit/4824e2d328a3a783323f7a1c9df60eb0fc1c218f)| Implemented the REST endpoints for leaving and deleting a game. | Basic game Functionality |
|                    | 17.04   | [Link to Commit 2](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/b3eaa3b68dee7e149403882bfd3982e4f2a70a23) | Implemented the frontend page for the profile editing functionality | Required for User Story 1 |
| **[@IsSaudade]** | 17.04   | [Link to Commit 1](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/c958d2cb7133726de148cd88ff3deaebdb0fde4f) | Change Profile: uses the useApiClient() hook |using the API client that match the backend |
|                    | 17.04   | [Link to Commit 2](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/c13e330fea5dd5cdf220eba2468c4d55906bc40e) | Change Gametable: Use the API client and follow the REST specification  | using the API client that match the backend |

---

## Contributions Week 4 - [28.04] to [04.05]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@TauSigma5]**   | 01.05    | [Link to PR 1](https://github.com/Qavrox/sopra-fs25-group-45-client/pull/26) | Add FE for GameOver/Win Declaration | FE part of Task #35 done |
| **[@TauSigma5]**   | 01.05    | [Link to PR 2](https://github.com/Qavrox/sopra-fs25-group-45-server/pull/74) | Expose BE endpoint for winner determination | BE part of Task #35 done |
| **[@Qavrox]**   | 30.04    | [Link to Commit 1](https://github.com/Qavrox/sopra-fs25-group-45-server/pull/73) | Fix the bug that blocked the whole team for a week (which took Aaron and me more than 2 days to locate the problem). This simple DTO problem crashes the whole backend when the game moves to the next round. | Basic game function |
| **[@Qavrox]**   | 30.04    | [Link to Commit 2](https://github.com/Qavrox/sopra-fs25-group-45-client/tree/FixTutorialCSS) | Fix the missing CSS problem on tutorial page | To meet US13 |
| **[@Qavrox]**   | 01.05    | [Link to Commit 3](https://github.com/Qavrox/sopra-fs25-group-45-client/tree/HomePage) | Implemented a landing page for users to log in or register | To help users to log in or register |
| **[@IsSaudade]** | 02.05   | [Link to Commit 1](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/7c41c4253f72f2e809e3e9f7c01827be4eb42e6e) | Beautify and improve the homepage |Interface-beautification |
|                    | 04.05   | [Link to Commit 2](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/fc26d74abbbfd13b76aa6c0dff14d8efc543082f) | Beautify Browse Available Tables and enhance user experience  | Interface-beautification |
| **[@lydia-milena]**   |     |  |  | No Contributions, joker used |
| **[@lydia-milena]**   |     |  |  | No Contributions, joker used |
| **[@unscttp]**   | 02.05    | [Link to commit 1](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/8e2e297293e1f2a02b00ecf696d376374adf3c9b) | Initial attempt for display of friends list | Attempt on basic user interaction, overwritten by further work, joker used  |
| **[@unscttp]**   |  | |  | joker used |
---

## Contributions Week 5 - [05.05] to [11.05]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@Qavrox]**   | 07.05    | [Link to commit 1](https://github.com/Qavrox/sopra-fs25-group-45-client/pull/32/commits/9b979e077fdec0be3fe5571ef76bde5e17e29f30) | Add a tutorial card on game table | required in the user stories |
| **[@Qavrox]**   | 08.05    | [Link to commit 2](https://github.com/Qavrox/sopra-fs25-group-45-client/pull/32/commits/c89d91025e921b05ceb2fb74176760425c53e260) | Add accessibility to profile page | Users can access profile page from lobby page |
| **[@Qavrox]**   | 08.05    | [Link to Commit 3](https://github.com/Qavrox/sopra-fs25-group-45-client/pull/32/commits/63c6e9bc69392f00bb3644f17efac6d7c2650dee) | Fixed goBack button on profile page. | Users can go back to lobby from profile page |
| **[@Qavrox]**   | 08.05    | [Link to Commit 4](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/317c258a1e6ac73d29b98c40f0ad96299ff288fc) | Push back after editing profile | Users now know if their edit is successful |
| **[@TauSigma5]**   | 08.05    | [Link to PR 1](https://github.com/Qavrox/sopra-fs25-group-45-client/pull/33) | Fixes GameTable CSS and add win probability calculation button | Fixes some important bugs and almost finishes US#10 |
| **[@TauSigma5]**   | 08.05    | [Link to PR 2](https://github.com/Qavrox/sopra-fs25-group-45-server/pull/77) | Start on external API stuff with Google Generative Language API | 70% done with external API stuff for BE |
| **[@lydia-milena]**   | 08.05    | [Link to PR 1](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/b1271ba4c92ded9e96928be0ba8708240b8ccfff) | Implemented friend request frontend | User Story 7 |
| **[@lydia-milena]**   | 08.05    | [Link to PR 2](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/b1271ba4c92ded9e96928be0ba8708240b8ccfff) | Implemented friends display and fixed up the user profile display and edit front end | User Story 7 and general functionality |
| **[@unscttp]**   | 05.05    | [Link to PR 1](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/1c11cfa8ef12641cb2cb85dad684f2620a2b53c5) | Implemented myprofile page | basic app function |
| **[@unscttp]**   | 07.05    | [Link to PR 2](https://github.com/Qavrox/sopra-fs25-group-45-client/commit/cee27e96dea613f6b601bcd4ea1b3c7ee625eed4) | Implemented List of all users | basic app function |
| **[@IsSaudade]**   | 11.05    | [Link to commit 1](https://github.com/Qavrox/sopra-fs25-group-45-client/pull/37/commits/af67e983bfc25135938cf5e9b9757bf75cc77654) | Beautify homepage and tutorial page | For better user experience  |
| **[@IsSaudade]**   | 11.05     | [Link to commit 2](https://github.com/Qavrox/sopra-fs25-group-45-client/pull/37/commits/af67e983bfc25135938cf5e9b9757bf75cc77654) | Beautify lobby page and gametable | For better user experiencee |
---

## Contributions Week 6 - [Begin Date] to [End Date]

_Continue with the same table format as above._
