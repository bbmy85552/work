import React, { useEffect } from 'react'

export default function ProductGallery() {
  useEffect(() => {
    // 平滑滚动
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    // 添加锚点点击监听
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick)
    })

    // 滚动动画观察器
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0)'
        }
      })
    }, observerOptions)

    // 观察所有需要动画的元素
    document.querySelectorAll('.section-fade-in').forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
      observer.observe(el)
    })

    // 导航栏滚动效果
    const handleScroll = () => {
      const nav = document.querySelector('.gallery-nav')
      if (nav) {
        if (window.scrollY > 100) {
          nav.classList.add('shadow-lg')
        } else {
          nav.classList.remove('shadow-lg')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    // 清理函数
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick)
      })
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="product-gallery-container">
      {/* 导航栏 */}
      <nav className="gallery-nav fixed top-0 w-full z-50 glass-effect border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center mr-3">
                  <i className="fa fa-graduation-cap text-white text-lg"></i>
                </div>
                <span className="text-xl font-bold gradient-text">学智AI</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#home" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">首页</a>
                <a href="#products" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">产品展示</a>
                <a href="#cases" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">学校案例</a>
                <a href="#about" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">关于我们</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 首页横幅 */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 brand-gradient rounded-2xl flex items-center justify-center">
              <i className="fa fa-graduation-cap text-white text-3xl"></i>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
            智慧校园，AI相伴
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            学智AI打造全方位校园智能生态系统，涵盖学习、生活、安全、健康等各个领域，<br />
            让人工智能技术真正服务于教育，为师生创造更智能、更高效的校园生活。
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-blue-100">
            <span className="text-sm font-semibold text-primary mr-3">12款智能设备</span>
            <span className="w-1 h-1 bg-blue-200 rounded-full"></span>
            <span className="text-sm font-semibold text-primary mx-3">覆盖全校园场景</span>
            <span className="w-1 h-1 bg-blue-200 rounded-full"></span>
            <span className="text-sm font-semibold text-primary ml-3">8K专业画质</span>
          </div>
        </div>
      </section>

      {/* 产品展示 */}
      <section id="products" className="py-20 px-4 sm:px-6 lg-px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* 学习场景 */}
          <div className="mb-20 section-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold gradient-text mb-4">学习场景</h2>
              <p className="text-gray-600">智能助力学习，提升教育质量</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 学习助手机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/Z0h91vjxpI"
                    alt="学智AI学习助手机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">学习助手机器人</h3>
                    <p className="text-sm opacity-90">图书馆智能助手，为学生提供学习咨询、图书查询等服务</p>
                  </div>
                </div>
              </div>

              {/* 智能教学讲台 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/g8U01vjxpH"
                    alt="学智AI智能教学讲台"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">智能教学讲台</h3>
                    <p className="text-sm opacity-90">集成AI技术的智能教学设备，提升课堂教学效率和互动性</p>
                  </div>
                </div>
              </div>

              {/* 图书馆助手机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/1Ouj1vjxpI"
                    alt="学智AI图书馆助手机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">图书馆助手机器人</h3>
                    <p className="text-sm opacity-90">帮助学生查找图书、整理书架的智能机器人助手</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 生活场景 */}
          <div className="mb-20 section-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold gradient-text mb-4">生活场景</h2>
              <p className="text-gray-600">智能便捷生活，提升校园体验</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 宿舍助手机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/8RSk1vjxsu"
                    alt="学智AI宿舍助手机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">宿舍助手机器人</h3>
                    <p className="text-sm opacity-90">管理日常作息、提醒课程安排的智能生活助手</p>
                  </div>
                </div>
              </div>

              {/* 校园导航机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/e1nF1vjxpI"
                    alt="学智AI校园导航机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">校园导航机器人</h3>
                    <p className="text-sm opacity-90">校园内的智能导航助手，帮助学生快速找到目的地</p>
                  </div>
                </div>
              </div>

              {/* 食堂服务机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/IhD01vjxsu"
                    alt="学智AI食堂服务机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">食堂服务机器人</h3>
                    <p className="text-sm opacity-90">智能送餐服务，提升食堂就餐效率和体验</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 体育与艺术场景 */}
          <div className="mb-20 section-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold gradient-text mb-4">体育与艺术场景</h2>
              <p className="text-gray-600">智能培养全面发展，提升综合素质</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 体育训练助手机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/Ytop1vjxsu"
                    alt="学智AI体育训练助手机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">体育训练助手机器人</h3>
                    <p className="text-sm opacity-90">提供专业运动指导和训练数据监测的智能教练</p>
                  </div>
                </div>
              </div>

              {/* 艺术创作助手机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/Uy161vjxsv"
                    alt="学智AI艺术创作助手机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">艺术创作助手机器人</h3>
                    <p className="text-sm opacity-90">协助学生进行绘画、设计等艺术创作的智能助手</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 安全与健康场景 */}
          <div className="mb-20 section-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold gradient-text mb-4">安全与健康场景</h2>
              <p className="text-gray-600">智能守护校园安全，关注师生身心健康</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 校园安全巡逻机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/pTfj1vjxsu"
                    alt="学智AI校园安全巡逻机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">校园安全巡逻机器人</h3>
                    <p className="text-sm opacity-90">24小时智能巡逻，保障校园安全的移动监控系统</p>
                  </div>
                </div>
              </div>

              {/* 实验室助手机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/f5531vjxpK"
                    alt="学智AI实验室助手机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">实验室助手机器人</h3>
                    <p className="text-sm opacity-90">科学实验中的智能助手，协助学生进行精确的实验操作</p>
                  </div>
                </div>
              </div>

              {/* 心理健康助手机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/5Ebr1vjxsv"
                    alt="学智AI心理健康助手机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">心理健康助手机器人</h3>
                    <p className="text-sm opacity-90">提供情感支持和心理疏导的智能心理咨询师</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 户外学习场景 */}
          <div className="section-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold gradient-text mb-4">户外学习场景</h2>
              <p className="text-gray-600">智能拓展学习空间，享受自然环境</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 智能学习平板 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/2nJ91vjxpI"
                    alt="学智AI智能学习平板"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">智能学习平板</h3>
                    <p className="text-sm opacity-90">学生们使用AI智能平板进行协作学习的场景</p>
                  </div>
                </div>
              </div>

              {/* 户外学习助手机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/XeTd1vjxkH"
                    alt="学智AI户外学习助手机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">户外学习助手机器人</h3>
                    <p className="text-sm opacity-90">结合无人机、机器人和智能眼镜的户外学习生态系统</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 学校案例展示 */}
      <section id="cases" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 section-fade-in">
            <h2 className="text-4xl font-bold gradient-text mb-6">全国学校落地案例</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">学智AI已在全国超过100所学校成功落地应用，覆盖小学、初中、高中、大学全学段</p>
          </div>

          {/* 小学案例 */}
          <div className="mb-20 section-fade-in">
            <div className="flex items-center mb-10">
              <div className="w-14 h-14 brand-gradient rounded-full flex items-center justify-center mr-4">
                <i className="fa fa-child text-white text-2xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">小学应用案例</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* 小学智能教室 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/is371vkcnz"
                    alt="学智AI小学智能教室"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">智能教室机器人</h4>
                    <p className="text-sm opacity-90">上海实验小学 - 机器人老师与小学生互动</p>
                  </div>
                </div>
              </div>

              {/* 小学智能校园管理 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/GUgR1vkcno"
                    alt="学智AI小学智能校园管理系统"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">智能校园管理系统</h4>
                    <p className="text-sm opacity-90">北京中关村第三小学 - AI监控保障安全</p>
                  </div>
                </div>
              </div>

              {/* 小学数学学习机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/w7m81vkcsz"
                    alt="学智AI小学数学学习机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">数学学习机器人</h4>
                    <p className="text-sm opacity-90">广州华阳小学 - 智能数学辅导提升成绩</p>
                  </div>
                </div>
              </div>

              {/* 小学音乐教育机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/bnnk1vkcsy"
                    alt="学智AI小学音乐教育机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">音乐教育机器人</h4>
                    <p className="text-sm opacity-90">深圳南山实验学校 - AI音乐教学系统</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 初中案例 */}
          <div className="mb-20 section-fade-in">
            <div className="flex items-center mb-10">
              <div className="w-14 h-14 brand-gradient rounded-full flex items-center justify-center mr-4">
                <i className="fa fa-graduation-cap text-white text-2xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">初中应用案例</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* 初中科学实验室 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/paxw1vkcnq"
                    alt="学智AI初中科学实验室"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">AI科学实验室</h4>
                    <p className="text-sm opacity-90">深圳实验中学初中部 - AI辅助科学实验</p>
                  </div>
                </div>
              </div>

              {/* 初中语言学习实验室 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/L7gu1vkcnq"
                    alt="学智AI初中语言学习实验室"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">AI语言学习实验室</h4>
                    <p className="text-sm opacity-90">广州执信中学初中部 - 智能语言学习系统</p>
                  </div>
                </div>
              </div>

              {/* 初中历史学习系统 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/DWVb1vkcsz"
                    alt="学智AI初中历史学习系统"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">AI历史学习系统</h4>
                    <p className="text-sm opacity-90">杭州文澜中学 - AR历史探索系统</p>
                  </div>
                </div>
              </div>

              {/* 初中艺术设计工作室 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/qM301vkct0"
                    alt="学智AI初中艺术设计工作室"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">AI艺术设计工作室</h4>
                    <p className="text-sm opacity-90">成都七中初中部 - 数字艺术创作平台</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 高中案例 */}
          <div className="mb-20 section-fade-in">
            <div className="flex items-center mb-10">
              <div className="w-14 h-14 brand-gradient rounded-full flex items-center justify-center mr-4">
                <i className="fa fa-university text-white text-2xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">高中应用案例</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* 高中职业规划指导 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/Tx351vkcnv"
                    alt="学智AI高中职业规划指导"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">AI职业规划指导</h4>
                    <p className="text-sm opacity-90">杭州第二中学 - 智能职业规划系统</p>
                  </div>
                </div>
              </div>

              {/* 高中高考备考系统 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/TEKW1vkcnp"
                    alt="学智AI高中高考备考系统"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">AI高考备考系统</h4>
                    <p className="text-sm opacity-90">成都七中 - 个性化备考系统</p>
                  </div>
                </div>
              </div>

              {/* 高中STEM教育实验室 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/RDyR1vkcsz"
                    alt="学智AI高中STEM教育实验室"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">AI STEM教育实验室</h4>
                    <p className="text-sm opacity-90">上海中学 - 机器人编程教育平台</p>
                  </div>
                </div>
              </div>

              {/* 高中创业教育项目 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/8WXG1vkcsz"
                    alt="学智AI高中创业教育项目"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">AI创业教育项目</h4>
                    <p className="text-sm opacity-90">深圳中学 - 青少年创业孵化平台</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 大学案例 */}
          <div className="mb-20 section-fade-in">
            <div className="flex items-center mb-10">
              <div className="w-14 h-14 brand-gradient rounded-full flex items-center justify-center mr-4">
                <i className="fa fa-briefcase text-white text-2xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-800">大学应用案例</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* 大学研究助理机器人 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://aka.doubaocdn.com/s/Sy6m1vkctK"
                    alt="学智AI大学研究助理机器人"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold mb-2">AI研究助理机器人</h4>
                    <p className="text-sm opacity-90">清华大学 - 科研实验室智能助手</p>
                  </div>
                </div>
              </div>

              {/* 大学AI教学平台 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa fa-laptop text-white text-3xl"></i>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-gray-800">AI教学平台</h4>
                  <p className="text-sm text-gray-600">北京大学 - 智能在线教育系统</p>
                </div>
              </div>

              {/* 大学创新创业中心 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa fa-lightbulb-o text-white text-3xl"></i>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-gray-800">创新创业中心</h4>
                  <p className="text-sm text-gray-600">复旦大学 - AI创业孵化平台</p>
                </div>
              </div>

              {/* 大学智能图书馆 */}
              <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover-lift bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa fa-book text-white text-3xl"></i>
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-gray-800">智能图书馆系统</h4>
                  <p className="text-sm text-gray-600">上海交通大学 - 智慧图书馆管理</p>
                </div>
              </div>
            </div>
          </div>

          {/* 合作学校数量展示 */}
          <div className="section-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl p-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold gradient-text mb-4">合作学校已超过100所</h3>
                <p className="text-gray-600 text-lg">学智AI已服务全国多所知名学校，覆盖小学、初中、高中、大学全学段</p>
              </div>

              {/* 学校校徽展示 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                {/* 高校代表 */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-xl">清华</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">清华大学</h4>
                  <p className="text-sm text-gray-600">高校代表</p>
                </div>

                {/* 重点中学代表 */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-xl">二中</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">杭州第二中学</h4>
                  <p className="text-sm text-gray-600">重点中学代表</p>
                </div>

                {/* 实验小学代表 */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-xl">实验</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">上海实验小学</h4>
                  <p className="text-sm text-gray-600">实验小学代表</p>
                </div>

                {/* 国际学校代表 */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-xl">国际</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">北京国际学校</h4>
                  <p className="text-sm text-gray-600">国际学校代表</p>
                </div>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold gradient-text mb-2">100+</div>
                  <div className="text-gray-600">合作学校</div>
                </div>
                <div>
                  <div className="text-4xl font-bold gradient-text mb-2">4</div>
                  <div className="text-gray-600">全学段覆盖</div>
                </div>
                <div>
                  <div className="text-4xl font-bold gradient-text mb-2">30+</div>
                  <div className="text-gray-600">城市覆盖</div>
                </div>
                <div>
                  <div className="text-4xl font-bold gradient-text mb-2">98%</div>
                  <div className="text-gray-600">满意度</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 关于我们 */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 section-fade-in">
            <h2 className="text-4xl font-bold gradient-text mb-6">设计理念</h2>
            <p className="text-xl text-gray-600">学智AI，让教育更智能，让校园更美好</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 section-fade-in">
            {/* 品牌一致性 */}
            <div className="text-center p-8 bg-neutral rounded-2xl">
              <div className="w-16 h-16 brand-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa fa-paint-brush text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">品牌一致性</h3>
              <p className="text-gray-600">严格遵循学智AI蓝白配色方案，保持立方体元素的品牌识别度</p>
            </div>

            {/* 教育场景化 */}
            <div className="text-center p-8 bg-neutral rounded-2xl">
              <div className="w-16 h-16 brand-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa fa-bullseye text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">教育场景化</h3>
              <p className="text-gray-600">深入校园实际应用场景，设计真正解决教育痛点的智能设备</p>
            </div>

            {/* 人机交互 */}
            <div className="text-center p-8 bg-neutral rounded-2xl">
              <div className="w-16 h-16 brand-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa fa-handshake-o text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">人机交互</h3>
              <p className="text-gray-600">强调自然流畅的人机互动，让AI技术真正服务于师生</p>
            </div>

            {/* 生态完整性 */}
            <div className="text-center p-8 bg-neutral rounded-2xl">
              <div className="w-16 h-16 brand-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa fa-cubes text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">生态完整性</h3>
              <p className="text-gray-600">构建完整的校园智能生态系统，覆盖学习生活各个领域</p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-dark text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 brand-gradient rounded-lg flex items-center justify-center mr-3">
                  <i className="fa fa-graduation-cap text-white text-lg"></i>
                </div>
                <span className="text-xl font-bold">学智AI</span>
              </div>
              <p className="text-gray-400 mb-6">"智建未来，简驭校园"</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fa fa-weibo text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fa fa-wechat text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fa fa-qq text-xl"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">产品服务</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">学习助手机器人</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">智能教学设备</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">校园管理系统</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">安全监控系统</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">解决方案</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">小学教育方案</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">中学教育方案</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">大学教育方案</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">职业教育方案</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">联系我们</h4>
              <ul className="space-y-3">
                <li class="flex items-start">
                  <i class="fa fa-phone mt-1 mr-3"></i>
                  <span>19865999996</span>
                </li>
                <li class="flex items-start">
                  <i class="fa fa-envelope mt-1 mr-3"></i>
                  <span>info@xuezhiai.cn</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2025 学智AI. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
