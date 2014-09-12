// from http://stackoverflow.com/questions/3286595/update-textarea-value-but-keep-cursor-position

sand.define('DOM/selection', function() {
  
  var offsetToRangeCharacterMove = function(el, offset) {
    return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
  };
  
  return {
    getInputSelection : function(el) {
      var start = 0, end = 0, normalizedValue, range,
          textInputRange, len, endRange;

      if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
          start = el.selectionStart;
          end = el.selectionEnd;
      } else {
          range = document.selection.createRange();

          if (range && range.parentElement() == el) {
              len = el.value.length;
              normalizedValue = el.value.replace(/\r\n/g, "\n");

              // Create a working TextRange that lives only in the input
              textInputRange = el.createTextRange();
              textInputRange.moveToBookmark(range.getBookmark());

              // Check if the start and end of the selection are at the very end
              // of the input, since moveStart/moveEnd doesn't return what we want
              // in those cases
              endRange = el.createTextRange();
              endRange.collapse(false);

              if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                  start = end = len;
              } else {
                  start = -textInputRange.moveStart("character", -len);
                  start += normalizedValue.slice(0, start).split("\n").length - 1;

                  if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                      end = len;
                  } else {
                      end = -textInputRange.moveEnd("character", -len);
                      end += normalizedValue.slice(0, end).split("\n").length - 1;
                  }
              }
          }
      }

      return {
          start: start,
          end: end
      };
    },

    setInputSelection : function(el, startOffset, endOffset) {
        if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
            el.selectionStart = startOffset;
            el.selectionEnd = endOffset;
        } else {
            var range = el.createTextRange();
            var startCharMove = offsetToRangeCharacterMove(el, startOffset);
            range.collapse(true);
            if (startOffset == endOffset) {
                range.move("character", startCharMove);
            } else {
                range.moveEnd("character", offsetToRangeCharacterMove(el, endOffset));
                range.moveStart("character", startCharMove);
            }
            range.select();
        }
      },

      saveSelection : function(containerEl) {
          var charIndex = 0, start = 0, end = 0, foundStart = false, stop = {};
          var sel = rangy.getSelection(), range;

          function traverseTextNodes(node, range) {
              if (node.nodeType == 3) {
                  if (!foundStart && node == range.startContainer) {
                      start = charIndex + range.startOffset;
                      foundStart = true;
                  }
                  if (foundStart && node == range.endContainer) {
                      end = charIndex + range.endOffset;
                      throw stop;
                  }
                  charIndex += node.length;
              } else {
                  for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                      traverseTextNodes(node.childNodes[i], range);
                  }
              }
          }

          if (sel.rangeCount) {
              try {
                  traverseTextNodes(containerEl, sel.getRangeAt(0));
              } catch (ex) {
                  if (ex != stop) {
                      throw ex;
                  }
              }
          }

          return {
              start: start,
              end: end
          };
      },
  restoreSelection : function(containerEl, savedSel) {
    var charIndex = 0, range = rangy.createRange(), foundStart = false, stop = {};
    range.collapseToPoint(containerEl, 0);

    function traverseTextNodes(node) {
        if (node.nodeType == 3) {
            var nextCharIndex = charIndex + node.length;
            if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                range.setStart(node, savedSel.start - charIndex);
                foundStart = true;
            }
            if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                range.setEnd(node, savedSel.end - charIndex);
                throw stop;
            }
            charIndex = nextCharIndex;
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                traverseTextNodes(node.childNodes[i]);
            }
        }
    }

    try {
        traverseTextNodes(containerEl);
    } catch (ex) {
        if (ex == stop) {
            rangy.getSelection().setSingleRange(range);
        } else {
            throw ex;
        }
    }
},

  clear : function() {
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }
  }
  };
  
});