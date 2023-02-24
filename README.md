Release note:

appcenter login

```
- Release iOS
```shell
appcenter codepush release-react -a Univest/univest-ios -d Production
```

- Release Android
```shell
appcenter codepush release-react -a Univest/univest-android -d Production
```

=======
Change key for specific environment
# app center: 

Android
┌────────────┬───────────────────────────────────────┐
│ Name       │ Key                                   │
├────────────┼───────────────────────────────────────┤
│ Production │ 8NdBVvA1j138K42L_kd7JT8mhKPsaOk_j2tPe
├────────────┼───────────────────────────────────────┤
│ Staging    │ aiiXn797mhhVr7iaCDkbACzyLQskHVa9_wk_9 │
└────────────┴───────────────────────────────────────┘

iOS
┌────────────┬───────────────────────────────────────┐
│ Name       │ Key                                   │
├────────────┼───────────────────────────────────────┤
│ Production │ 9v8V03YDQ29BBJfDwif6fj63QNnKiXCKOvL9L |
├────────────┼───────────────────────────────────────┤
│ Staging    │ HB8Jnn_QKXsDO2l65hvJ3LByyp02oLqpwnA6f │
└────────────┴───────────────────────────────────────┘


# FOR TEST
appcenter codepush release-react -a JoeStudio/Test-Android -d Staging
appcenter codepush release-react -a JoeStudio/Test -d Staging

# bugsnag
key: 
