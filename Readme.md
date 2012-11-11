# Aisfetcher

Aisfetcher is a Node.js command line tool to fetch & filter real-time data from an AIS TCP stream.

## Installation

    $ git clone git@github.com:mjaros/aisfetcher.git
    $ cd aisfetcher
    $ npm install
    $ npm link

## Usage

To connect to host "example.com" on port "12345" and receive the unfiltered stream:

    $ aisfetcher -h example.com -p 12345

If you would like to filter for all messages with a message id of 5:

    $ aisfetcher -h example.com -p 12345 -f msgid:5