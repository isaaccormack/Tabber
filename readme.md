# Tabber
Play licks, get tabs.

## What's a Lick? 
We define a lick as a short musical phrase in which only one note is played at a time.

## Ok, Well Whats Tabber?
Tabber is a web app which generates tablature for licks played from an instrument (guitar, bass, piano, etc) into the computers microphone. Along with this, Tabber proides musicians a play to store and share their original licks, or licks from popular songs.

## How do we Make Tabber?
Tabber takes advantage of an existing machine learning model, such as ml5's pitch detection, to classify notes. The location of these notes on the instrument (say, guitar neck) is then determined using a heuristic considering past and (future?) notes and the likelihood of their proximity. The heuristic could possibly be machine learning based. 

Tabber also consists of an online app platform which implements many featurs (listed below) using standard web technologies.

## Why Bother?
- Writing down tabs is slow, Tabber is fast
- Getting tabs is as easy, just play
- Lots of great licks are just that... _licks_

## Lets Talk Requirements
Just to feel out the app, a couple requirements are given below.

### Core Requirement
- Abilty to generate tablature in a .txt format during, or after, a lick is played into the computers microphone via a guitar, bass, or piano.

### App Features
- Ability to create an account
    - A user is able to save their recorded licks with tablature
    - _*maybe_ A user is able to play the tabs back through a different instrument (ie. synth tones, piano, etc.)
- Ability to share tabs between users
- Ability to export tabs to pdf
- _*maybe_ Ability to upload licks to be tabbed in a variety of formats 

### Quality Requirements
- _Usability_ - Simple and intuitive to use, minimal interface, attractive.
- _Responsiveness_ - User requests are handled immediately. (ie. stop recording)
- _Performance_ - Low latency in tab generation

## Maybe a Couple Use Cases Too
Just some easy ones.

### As a Song Writer, I want to:
1. Have my licks tabbed automatically to save time.
2. Store my licks for future reference.
3. Have my licks and tabs stored in the same place for convenience.
4. Be able to download my tabs in a _pretty_ .pdf format to showcase my work.

### As a Guitar Player, I want to:
1. Tab a famous guitar lick so I can send it to my friend to help him learn the lick.

### As a Beginner, I want to:
1. Use a _pretty_ website so all my friends will be jealous.
