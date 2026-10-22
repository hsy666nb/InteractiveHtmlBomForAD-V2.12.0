# InteractiveHtmlBomForAD

本文件是在原作者的基础上再优化的,实际上V2.12是原版的版本号，这个程序兼容原版了之后，我又优化了以下BUG，但是目前的版本号依旧还是先用V2.12.0，现在已经完全够使用到AD里了，不烧心~

新版LOG
        一些修复和优化:

        1、修复:生成BOM时，无法截取源文件'.'符号及其之后的字符的问题。
        2、修复:当PCB封装内有AD24以上版本的"自定义焊盘"时，生成失败的问题。
        3、修复:当PCB封装内有走线时，生成失败的问题。
        4、优化页面，现在页面里大部分描述都是中文的了

        使用方法：
                在\InteractiveHtmlBomForAD-master根目录下双击Initialize.bat批处理文件。 然后用AD打开PCB文件，

        临时使用：
              点选[文件]-[运行脚本]（快捷键FS），然后点选[浏览]-[来自文件]，打开InteractiveHtmlBomForAD.PrjScr。
        一直使用：
              右上角点选[设置]-[Scripting System]-[Global Projects]，然后点选[安装]-[从文件夹安装]，打开InteractiveHtmlBomForAD.PrjScr，然后再点选[文件]-[运行脚本]（快捷键FS）。

        然后双击startWin，选好保存地址后点生成BOM即可
