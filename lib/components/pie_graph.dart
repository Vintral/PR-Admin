import 'package:flutter/material.dart';
import 'package:charts_flutter/flutter.dart' as charts;
import 'package:pocket_realm_admin/models/chart_data.dart';

class PieGraph extends StatelessWidget {
  final List<ChartData> data;
  final double size;
  final bool showLabels;

  PieGraph({@required this.data, this.size = 100, this.showLabels = true });

  @override
  Widget build(BuildContext context) {
    List<charts.Series<ChartData, String>> series = [
      charts.Series(
        id: "Data",
        data: data,
        domainFn: ( ChartData d, _) => d.type,
        measureFn: ( ChartData d, _) => d.value,
        colorFn: ( ChartData d,_) => d.barColor,
        labelAccessorFn: ( ChartData d,_) => d.type,
      )
    ];

    return Container(
      height:size,
      width:size,
      child: charts.PieChart(
        series, 
        animate:true,
        defaultRenderer: charts.ArcRendererConfig(
          arcWidth: size ~/ 2,
          arcRendererDecorators: [ showLabels ? charts.ArcLabelDecorator() : "" ],
        ),
      )
    );
  }
}