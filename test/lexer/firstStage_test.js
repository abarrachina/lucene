'use strict';

const expect = require('chai').expect;

const lexFirstStage = require('../../lib/lexer/firstStage');

describe.only('lexer/firstStage', () => {
  describe('terms', () => {
    it('must parse simple terms', () => {
      expect(lexFirstStage('hello')).to.deep.equal([
        {
          token: 'term',
          lexeme: 'hello',
          start: 0,
          end: 5
        }
      ]);
    });
  });

  describe('phrases', () => {
    it('must parse simple phrases', () => {
      expect(lexFirstStage('"foo bar"')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"foo bar"',
          start: 0,
          end: 9
        }
      ]);
    });

    it('must support escaped quotes', () => {
      expect(lexFirstStage('"a\\"b"')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"a\\"b"',
          start: 0,
          end: 6
        }
      ]);
    });

    it('must support escaped quotes at the end of a phrase', () => {
      expect(lexFirstStage('"a\\""')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"a\\""',
          start: 0,
          end: 5
        }
      ]);
    });

    it('must ignore multiple escaped backslashes at in phrases', () => {
      expect(lexFirstStage('"a\\\\"')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"a\\\\"',
          start: 0,
          end: 5
        }
      ]);
    });

    it('must consume to the end of the source when the phrase does not end', () => {
      expect(lexFirstStage('"a\\\\\\"')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"a\\\\\\"',
          start: 0,
          end: 6
        }
      ]);
    });

    it('must support escaped backslash and normal backslash at the end of a phrase', () => {
      expect(lexFirstStage('"a\\\\\\" abc"')).to.deep.equal([
        {
          token: 'phrase',
          lexeme: '"a\\\\\\" abc"',
          start: 0,
          end: 11
        }
      ]);
    });
  });

  describe('whitespace', () => {
    it('must parse just whitespace', () => {
      expect(lexFirstStage(' \n\t ')).to.deep.equal([
        {
          token: 'whitespace',
          lexeme: ' \n\t ',
          start: 0,
          end: 4
        }
      ]);
    });
  });

  describe('combinations', () => {
    it('must parse terms and phrases', () => {
      expect(lexFirstStage('foo "bar"')).to.deep.equal([
        {
          token: 'term',
          lexeme: 'foo',
          start: 0,
          end: 3
        },
        {
          token: 'whitespace',
          lexeme: ' ',
          start: 3,
          end: 4
        },
        {
          token: 'phrase',
          lexeme: '"bar"',
          start: 4,
          end: 9
        }
      ]);
    });

    it('must support fielded data', () => {
      expect(lexFirstStage('foo.bar:42')).to.deep.equal([
        {
          token: 'term',
          lexeme: 'foo.bar',
          start: 0,
          end: 7
        },
        {
          token: 'fieldSeparator',
          lexeme: ':',
          start: 7,
          end: 8
        },
        {
          token: 'term',
          lexeme: '42',
          start: 8,
          end: 10
        }
      ]);
    });
  });
});