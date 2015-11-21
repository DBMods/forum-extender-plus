<?php
  function parseVer($version) {
    $pieces = explode('.', $version);
    $final = [
      'major' => intval($pieces[0], 10),
      'minor' => intval($pieces[1], 10),
      'patch' => intval($pieces[2], 10)
    ];

    return $final;
  }
  $resp = 'Passed';
  $master = '2.6.1';
  $v = parseVer(explode('pre', $_GET['v'])[0]);
  $mVer = parseVer($master);

  if ($v['major'] < $mVer['major']) {
    //Major version behind
    $resp = 'Major version behind. Update to v' . $master . ' or newer for the script to work properly';
  } else {
    if ($v['major'] == $mVer['major']) {
      //If major versions match, check minor version
      if ($v['minor'] < $mVer['minor']) {
        //Minor version behind
        $resp = 'Minor version behind. Update to v' . $master . ' or newer for the script to work properly';
      } else {
        if ($v['minor'] == $mVer['minor']) {
          //If minor versions match, check patch version
          if ($v['patch'] < $mVer['patch']) {
            //Patch version behind
            $resp = 'Patch version behind. Update to v' . $master . ' or newer for the script to work properly';
          }
        }
      }
    }
  }

  echo $resp;
?>
