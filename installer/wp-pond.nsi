; WP Pond Windows installer.
; Built by installer/build.sh, which passes ARCH (x64|x86), VERSION, SRC_DIR and OUT_FILE.
; Installs per user (no admin prompt), adds the install folder to the user PATH so
; `wppond` works in any terminal, and registers an uninstaller in Apps & features.

Unicode true
SetCompressor /SOLID lzma
RequestExecutionLevel user
ManifestDPIAware true

!include "MUI2.nsh"
!include "x64.nsh"
!include "LogicLib.nsh"

!define APP_NAME "WP Pond"
!define APP_ID "WPPond"
!define PUBLISHER "Naymul Hasan Tanvir"
!define WEBSITE "https://naymul.com/wp-pond/"
!define UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}"

Name "${APP_NAME} ${VERSION}"
OutFile "${OUT_FILE}"
InstallDir "$LOCALAPPDATA\Programs\${APP_NAME}"
InstallDirRegKey HKCU "Software\${APP_ID}" "InstallDir"
BrandingText "${APP_NAME} ${VERSION} (${ARCH})"

VIProductVersion "${VERSION}.0"
VIAddVersionKey "ProductName" "${APP_NAME}"
VIAddVersionKey "ProductVersion" "${VERSION}"
VIAddVersionKey "FileVersion" "${VERSION}"
VIAddVersionKey "FileDescription" "${APP_NAME} ${VERSION} Setup (${ARCH})"
VIAddVersionKey "CompanyName" "${PUBLISHER}"
VIAddVersionKey "LegalCopyright" "${PUBLISHER}"

!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install-blue-full.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall-blue-full.ico"
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Open a terminal with WP Pond"
!define MUI_FINISHPAGE_RUN_FUNCTION OpenTerminal
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\README.txt"
!define MUI_FINISHPAGE_SHOWREADME_NOTCHECKED
!define MUI_FINISHPAGE_LINK "naymul.com/wp-pond"
!define MUI_FINISHPAGE_LINK_LOCATION "${WEBSITE}"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "${SRC_DIR}\LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

; PATH is edited through PowerShell's registry API rather than NSIS strings, which
; cap at 1024 characters and would truncate a long PATH. The folder is handed over
; in an environment variable so no path ever needs quoting inside the command.
!macro EditUserPath ACTION
  System::Call 'Kernel32::SetEnvironmentVariable(t "WPPOND_DIR", t "$INSTDIR")i'
  nsExec::Exec `powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "$$d=$$env:WPPOND_DIR; $$k=[Microsoft.Win32.Registry]::CurrentUser.CreateSubKey('Environment'); $$p=[string]$$k.GetValue('Path','',[Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames); $$parts=@($$p -split ';' | Where-Object { $$_ -and ($$_.TrimEnd('\') -ne $$d.TrimEnd('\')) }); if ('${ACTION}' -eq 'add') { $$parts += $$d }; $$k.SetValue('Path', ($$parts -join ';'), [Microsoft.Win32.RegistryValueKind]::ExpandString)"`
  Pop $0
  SendMessage ${HWND_BROADCAST} ${WM_SETTINGCHANGE} 0 "STR:Environment" /TIMEOUT=5000
!macroend

Function .onInit
  !if "${ARCH}" == "x64"
    ${IfNot} ${RunningX64}
      MessageBox MB_ICONSTOP "This is the 64-bit build of ${APP_NAME}. Download the x86 installer for 32-bit Windows."
      Abort
    ${EndIf}
  !endif
FunctionEnd

Function OpenTerminal
  ; A fresh cmd started by Explorer would not see the new PATH yet, so start in the install folder.
  ExecShell "open" "$SYSDIR\cmd.exe" '/k "cd /d "$INSTDIR" && wppond.exe info"'
FunctionEnd

Section "Install"
  SetOutPath "$INSTDIR"
  File "${SRC_DIR}\wppond.exe"
  File "${SRC_DIR}\wppond-helper.exe"
  File "${SRC_DIR}\README.txt"
  File "${SRC_DIR}\LICENSE"
  File "${SRC_DIR}\THIRD-PARTY-NOTICES.txt"

  WriteUninstaller "$INSTDIR\Uninstall.exe"

  CreateShortCut "$SMPROGRAMS\${APP_NAME}.lnk" "$SYSDIR\cmd.exe" '/k "cd /d "$INSTDIR" && wppond.exe info"' "$INSTDIR\wppond.exe" 0

  !insertmacro EditUserPath "add"

  WriteRegStr HKCU "Software\${APP_ID}" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "${UNINST_KEY}" "DisplayName" "${APP_NAME}"
  WriteRegStr HKCU "${UNINST_KEY}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "${UNINST_KEY}" "Publisher" "${PUBLISHER}"
  WriteRegStr HKCU "${UNINST_KEY}" "URLInfoAbout" "${WEBSITE}"
  WriteRegStr HKCU "${UNINST_KEY}" "DisplayIcon" "$INSTDIR\wppond.exe"
  WriteRegStr HKCU "${UNINST_KEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${UNINST_KEY}" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegStr HKCU "${UNINST_KEY}" "QuietUninstallString" '"$INSTDIR\Uninstall.exe" /S'
  WriteRegDWORD HKCU "${UNINST_KEY}" "NoModify" 1
  WriteRegDWORD HKCU "${UNINST_KEY}" "NoRepair" 1
SectionEnd

Section "Uninstall"
  !insertmacro EditUserPath "remove"

  Delete "$SMPROGRAMS\${APP_NAME}.lnk"
  Delete "$INSTDIR\wppond.exe"
  Delete "$INSTDIR\wppond-helper.exe"
  Delete "$INSTDIR\README.txt"
  Delete "$INSTDIR\LICENSE"
  Delete "$INSTDIR\THIRD-PARTY-NOTICES.txt"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir "$INSTDIR"

  DeleteRegKey HKCU "${UNINST_KEY}"
  DeleteRegKey HKCU "Software\${APP_ID}"
SectionEnd
