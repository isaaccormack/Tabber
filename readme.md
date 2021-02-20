<p align="center">
    <a href="https://tabber.icormack.com/" >
        <img src="https://github.com/isaaccormack/Tabber/blob/develop/webapp/public/logo.png" height="130">
    </a>
</p>

<p align="center">
    <img src="https://img.shields.io/github/package-json/v/isaaccormack/tabber/develop/server?style=flat-square" />
    <img src="https://img.shields.io/github/package-json/v/isaaccormack/tabber/develop/webapp?style=flat-square" />
    <img src="https://img.shields.io/david/isaaccormack/tabber?path=server&style=flat-square" />
    <img src="https://img.shields.io/github/contributors/isaaccormack/tabber?style=flat-square" />
    <img src="https://img.shields.io/github/issues-raw/isaaccormack/tabber?style=flat-square" />
    <img src="https://img.shields.io/codecov/c/github/isaaccormack/tabber/develop?style=flat-square" />
</p>

<h1 align="center">Play Licks, Get Tabs</h1>

:musical_score:	__Tabber__ is a simple web app which automatically tabs guitar licks. <music icon> <br/> <br/>
:guitar:	__Licks__ are short musical phrases where only a single note is played at a time. <br/> <br/>
:studio_microphone:	Simply __upload__ or __record__ a lick into your computers microphone and get tabs in seconds. <br/> <br/>
:revolving_hearts:	Licks are then __saved__ to your library where they can be __shared__ with friends.
    
<p align="right"><em>Check it out: <a href="https://tabber.ca">tabber.ca</a></em></p>

# How Does it Work?
Tabber uses a pre-trained machine learning model for both pitch and onset detection to determine which note was played and when. A heuristic is then used to estimate where the notes were likely played on the fretboard. Tabs are generated from these locations as raw text. 

# About
Tabber started as a UVic capstone project written in the summer of 2020 by three UVic students interested in solving new problems with machine learning. Since its initial implementaion, new features have been implemented periodically. Feedback or suggestions for new features are welcome! 


<br/>Tabber is currently an _alpha_ release. Please submit any bugs found as github issues.

# Contributing
Community additions are welcomed! Please see the readmes in `/webapp` and `/server` to get started developing the front or back-end. Feel free to reach out to me personally to discuss feature development, or submit a PR.
