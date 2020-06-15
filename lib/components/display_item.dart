import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:pocket_realm_admin/extensions/hover_extension.dart';

class DisplayItem extends StatefulWidget {
  final Widget child;
  final bool available;

  DisplayItem( { this.available = true, this.child } );

  @override
  _DisplayItemState createState() => _DisplayItemState();
}

class _DisplayItemState extends State<DisplayItem> with SingleTickerProviderStateMixin {
  AnimationController _controller;
  Animation<double> _tween;

  void onEnter( PointerEnterEvent event ) {    
    _controller.forward();
  }

  void onExit( PointerExitEvent event ) {    
    _controller.reverse();
  }

  @override
  void initState() {    
    super.initState();

    _controller = AnimationController(
      duration: Duration(milliseconds: 30),
      vsync: this,
    );
    _tween = Tween( begin: widget.available ? 5.0 : 0.0, end: widget.available ? 10.0 : 0.0 ).animate( _controller );
    _controller.addListener( () {
      setState( () {} );
    } );
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: onEnter,
      onExit: onExit,
      child: Card(
        color: Colors.blue[300],
        elevation: _tween.value,
        child: widget.child,
      ).showCursorOnHover
    );
  }
}