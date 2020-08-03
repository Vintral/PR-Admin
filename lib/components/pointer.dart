import 'package:flutter/gestures.dart';
import 'package:flutter/widgets.dart';
import 'package:universal_html/prefer_sdk/html.dart' as html;

class PointerCursor extends MouseRegion {
  static final appContainer = html.window.document.querySelectorAll('flt-glass-pane')[0];
    PointerCursor({Widget child}) : super(
        onHover: (PointerHoverEvent evt) {
            appContainer.style.cursor='pointer';
        },
        onExit: (PointerExitEvent evt) {
            appContainer.style.cursor='default';
        },
        child: child
    );    
}