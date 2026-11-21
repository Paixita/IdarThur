package com.idarthur.idarthur_app
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.content.pm.PackageManager
import androidx.core.content.FileProvider
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.io.File
class MainActivity:FlutterActivity(){
 override fun configureFlutterEngine(engine:FlutterEngine){
  super.configureFlutterEngine(engine)
  MethodChannel(engine.dartExecutor.binaryMessenger,"com.idarthur.app/updates").setMethodCallHandler{call,result->
   if(call.method!="install"){result.notImplemented();return@setMethodCallHandler}
   try{
    val file=File(call.argument<String>("path")?:"").canonicalFile
    val allowed=File(cacheDir,"updates").canonicalFile
    require(file.parentFile==allowed&&file.extension=="apk"&&file.isFile){"Ruta no permitida"}
    val flags=if(Build.VERSION.SDK_INT>=28)PackageManager.GET_SIGNING_CERTIFICATES else PackageManager.GET_SIGNATURES
    val archive=packageManager.getPackageArchiveInfo(file.path,flags)?:error("APK inválido")
    val current=packageManager.getPackageInfo(packageName,flags)
    require(archive.packageName==packageName){"Paquete distinto"}
    val newCode=if(Build.VERSION.SDK_INT>=28)archive.longVersionCode else archive.versionCode.toLong()
    val oldCode=if(Build.VERSION.SDK_INT>=28)current.longVersionCode else current.versionCode.toLong()
    require(newCode>oldCode){"La versión no es más reciente"}
    val newSign=if(Build.VERSION.SDK_INT>=28)archive.signingInfo?.apkContentsSigners else archive.signatures
    val oldSign=if(Build.VERSION.SDK_INT>=28)current.signingInfo?.apkContentsSigners else current.signatures
    require(newSign!=null&&oldSign!=null&&newSign.map{it.toCharsString()}.toSet()==oldSign.map{it.toCharsString()}.toSet()){"Firma de actualización no válida"}
    if(Build.VERSION.SDK_INT>=26&&!packageManager.canRequestPackageInstalls()){
     startActivity(Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,Uri.parse("package:$packageName")))
     result.error("permission","Autoriza las actualizaciones de IdarThur en Android y vuelve a pulsar Actualizar.",null)
    }else{
     val uri=FileProvider.getUriForFile(this,"$packageName.updates",file)
     startActivity(Intent(Intent.ACTION_VIEW).setDataAndType(uri,"application/vnd.android.package-archive").addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION))
     result.success(null)
    }
   }catch(e:Exception){result.error("update",e.message,null)}
  }
 }
}
