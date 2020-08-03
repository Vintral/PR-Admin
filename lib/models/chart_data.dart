import 'package:charts_flutter/flutter.dart' as charts;

class ChartData {
  final String type;
  final int value;
  final charts.Color barColor;

  ChartData( this.type, this.value, this.barColor );
}