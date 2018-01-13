# IntoYun SaaS Demo

## 环境要求
nodejs 8.6+

## 安装NodeJS

### Windows 安装
下载Nodejs安装包

[[Windows 32位]](https://nodejs.org/dist/v8.9.4/node-v8.9.4-x86.msi)&nbsp;&nbsp;[[Windows 64位]](https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi)

1. 下载完成后，双击“node-v8.9.4-x64.msi”，开始安装Node.js
![安装向导](https://upload-images.jianshu.io/upload_images/2267589-131af95ee6ebc811.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/618)

2. Node.js安装完成，可以先进行以下简单的测试安装是否成功了，在键盘按下【win+R】键，输入cmd，然后回车，打开cmd窗口。
![控制台](https://upload-images.jianshu.io/upload_images/2267589-19531194e378a38a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/513)

![命令行窗口](https://upload-images.jianshu.io/upload_images/2267589-2c9ced41baca7c1e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/700)

### Linux 安装
安装NodeJS 8.x版本
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

安装Linux开发工具包以及确认安装NodeJS成功
```
sudo apt-get install -y build-essential
node --version
```

### Mac OS 安装
1. 输入`brew -v`查看是否安装了homebrew，如果正确显示版本号，说明已经安装homebrew。如果没安装，输入以下命令安装
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

2. 通过homebrew安装NodeJS
```
brew uninstall node
brew install node
```

### 运行Demo

1. 将npm源改为taobao源
```
npm config set registry https://registry.npm.taobao.org
```

2. 进入工程目录，安装项目依赖包
```
npm install
```

3. 配置服务器授权
打开server/config.js，修改appId和appSecrect字段
```
{
  appId: '36466d0942eef9df6aadd01d0347ab45',      // 在IntoYun开发者平台申请的服务器授权ID。（修改为自己的服务器授权ID）
  appSecret: '6be36b51bf1c29f0b8eed27bdb205b5f',  // 授权密钥。（修改为自己的服务器授权密钥）
  version: 'v1',                                  // IntoYun提供的企业API接口版本，详细参考官网文档说明。默认为v1
  proxy: 'https://enterprise.intoyun.com',        // IntoYun企业API接口地址
  brokers: 'dps.intoyun.com:9092',                // IntoYun实时数据服务器
  sasl_enable: true                               // sasl参数，默认true。不需要修改。
}
```

4. 启动服务
```
npm start
```

5. [访问http://localhost:3000](http://localhost:3000)
