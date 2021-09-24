<div id="detailPanel">
	<div class="hd"></div>
	<div class="bd"></div>
	<div class="ft"></div>
</div>
<div>
	<div id="userform" class="ui-widget ui-widget-content ui-corner-all">
		<form action="." method="get" id="pdform">
      <select name="company" id="company">
        <option value="CHI">CHI</option>
        <option value="BCS">BCS</option>
      </select>
			<!--<input type="hidden" name="company" id="company" value="<?php echo Company::getCompany(); ?>">-->
			<select name="month" id="month">
				<option value="01">Jan</option>
				<option value="02">Feb</option>
				<option value="03">Mar</option>
				<option value="04">Apr</option>
				<option value="05">May</option>
				<option value="06">Jun</option>
				<option value="07">Jul</option>
				<option value="08">Aug</option>
				<option value="09">Sep</option>
				<option value="10">Oct</option>
				<option value="11">Nov</option>
				<option value="12">Dec</option>
			</select>
			<label for="year">Year:</label><input type="text" id="year" name="year" value="<?php echo date("Y"); ?>" style="width: 3em;">
      <input type="text" id="whse" name="whse" value="" placeholder="Whse: %" style="width:4em;">
      <input type="text" id="item" name="item" value="" placeholder="Item Number: %">
			<input type="checkbox" id="sortvariance" name="sortvariance" value="1" checked="checked"><label for="sortvariance">Sort by Variance</label>
			<input type="submit" id="getdata" name="getdata" value="Submit">
			<label for="years">Years of Detail</label>
			<select id="years">
			<?php for ($i = 2; $i < 10; $i++) {
				$selected = ($i == 3 ? 'selected="selected"' : '');
				echo "<option value=\"{$i}\" {$selected}>{$i}</option>";
			} ?>
			</select>
		</form>
	</div><!-- end of div#userform -->

</div>
<div id="tabs">
	<ul></ul>
</div>
