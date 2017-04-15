<?php

  require './includes/config.php';
  require './includes/get_data.php';

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Earth DATA</title>
    <!-- Links -->
    <link href="assets/css/app.min.css?<?= date('s'); ?>" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <div class="temp-container">
      <div class="container-graph">
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"></svg>
      </div>
      <div class="container-detailed-graph">
        <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="200" viewBox="0 0 500 500"></svg>
        <div class="info-month">
          <div>jan</div>
          <div>feb</div>
          <div>mar</div>
          <div>apr</div>
          <div>may</div>
          <div>jun</div>
          <div>jul</div>
          <div>aug</div>
          <div>sep</div>
          <div>oct</div>
          <div>nov</div>
          <div>dec</div>
        </div>
      </div>
      <div class="container-timeline">
        <div class="scroll-bar"></div>
        <div class="year-display">2000</div>
        <div class="timeline">
          <svg xmlns="http://www.w3.org/2000/svg" width="500" height="100" viewBox="0 0 500 100"></svg>
        </div>
      </div>
    </div>
    <script>
      var data = <?= json_encode($data) ?> ;
    </script>
    <script src="assets/js/app.min.js?<?= date('s'); ?>"></script>
  </body>
</html>