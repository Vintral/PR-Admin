import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:pocket_realm_admin/settings.dart';

class IPItem extends StatefulWidget {
  final String ip;

  IPItem( this.ip );

  @override
  _IPItemState createState() => _IPItemState();
}

class _IPItemState extends State<IPItem> with SingleTickerProviderStateMixin {
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
      duration: Settings.AnimationDuration,
      vsync: this,
    );
    _tween = Tween( begin: 3.0, end: 6.0 ).animate( _controller );
    _controller.addListener( () {
      setState( () {} );
    } );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: onEnter,
      onExit: onExit,
      child: Card(
        elevation: _tween.value,
        child: Padding(
          padding: EdgeInsets.symmetric( vertical: 10, horizontal: 20 ),
          child: Text( widget.ip ),
        ),
      )
    );
  }
}