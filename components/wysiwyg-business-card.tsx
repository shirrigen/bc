'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Edit, Download, Close, Instagram, YouTube, Twitter, GitHub, Chat, RotateRight, AddPhotoAlternate, Language } from '@mui/icons-material'
import html2canvas from 'html2canvas'
import Image from 'next/image'

type CardTheme = 'modern' | 'vintage' | 'trendy' | 'minimal' | 'bold' | 'custom'

type SocialMedia = {
  platform: string
  username: string
  icon: React.ReactNode
}

type CardInfo = {
  name: string
  position: string
  company: string
  email: string
  phone: string
  theme: CardTheme
  backgroundColor: string
  textColor: string
  borderWidth: number
  borderColor: string
  imageUrl: string
  font: string
  showSocial: boolean
  socialMedia: SocialMedia[]
  orientation: 'landscape' | 'portrait'
  backgroundImageUrl: string
}

const initialCardInfo: CardInfo = {
  name: 'Joe Dove',
  position: 'VP',
  company: 'FirstMeet Corp',
  email: 'joe.dove@fmcorp.com',
  phone: '+1 (555) 123-4567',
  theme: 'custom',
  backgroundColor: '#f0f0f0',
  textColor: '#ccddff',
  borderWidth: 2,
  borderColor: '#000000',
  imageUrl: '/default-avatar.png',
  font: 'Inter',
  showSocial: false,
  socialMedia: [
    { platform: 'instagram', username: '', icon: <Instagram fontSize="small" /> },
    { platform: 'youtube', username: '', icon: <YouTube fontSize="small" /> },
    { platform: 'twitter', username: '', icon: <Twitter fontSize="small" /> },
    { platform: 'github', username: '', icon: <GitHub fontSize="small" /> },
    { platform: 'chat', username: '', icon: <Chat fontSize="small" /> },
  ],
  orientation: 'landscape',
  backgroundImageUrl: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzFxMGJwd2lwaDhqcXFxZmNjaXVjZjk4ZjNzdnJma3k4ZmxocXJtZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S8ZM7uiGCJVv25rrhc/giphy.gif'
}

const themeStyles: Record<CardTheme, { 
  bg: string, 
  text: string, 
  border: string,
  font: string,
}> = {
  modern: { 
    bg: 'bg-gradient-to-br from-blue-100 to-indigo-200', 
    text: 'text-gray-800', 
    border: 'border-blue-300',
    font: 'font-sans',
  },
  vintage: { 
    bg: 'bg-amber-50', 
    text: 'text-amber-900', 
    border: 'border-amber-200',
    font: 'font-serif',
  },
  trendy: { 
    bg: 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400', 
    text: 'text-gray-800', 
    border: 'border-purple-300',
    font: 'font-sans',
  },
  minimal: { 
    bg: 'bg-white', 
    text: 'text-gray-900', 
    border: 'border-gray-200',
    font: 'font-sans',
  },
  bold: { 
    bg: 'bg-black', 
    text: 'text-white', 
    border: 'border-yellow-400',
    font: 'font-sans',
  },
  custom: {
    bg: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
    font: 'font-sans',
  },
}

const fonts = [
  'Inter',
  'Roboto',
  'Playfair Display',
  'Montserrat',
  'Lora',
  'Oswald',
]

const translations = {
  en: {
    title: 'Digital Business Card Generator',
    name: 'Name',
    position: 'Position',
    company: 'Company',
    email: 'Email',
    phone: 'Phone',
    theme: 'Theme',
    backgroundColor: 'Background Color',
    textColor: 'Text Color',
    borderWidth: 'Border Width',
    borderColor: 'Border Color',
    backgroundImage: 'Background Image',
    font: 'Font',
    showSocial: 'Show Social Media',
    uploadBackground: 'Upload Background',
    switchToLandscape: 'Switch to Horizontal',
    switchToPortrait: 'Switch to Vertical',
    saveImage: 'Save Image',
    themes: {
      modern: 'Modern',
      vintage: 'Vintage',
      trendy: 'Trendy',
      minimal: 'Minimal',
      bold: 'Bold',
      custom: 'Custom',
    },
    backgroundImageUrl: 'Background Image URL',
    edit: 'Edit',
    switchLayout: 'Switch Layout',
    horizontal: 'Horizontal',
    vertical: 'Vertical',
  },
  zh: {
    title: '简单名片',
    name: '姓名',
    position: '职位',
    company: '公司',
    email: '邮箱',
    phone: '电话',
    theme: '主题',
    backgroundColor: '背景颜色',
    textColor: '文字颜色',
    borderWidth: '边框宽度',
    borderColor: '边框颜色',
    backgroundImage: '背景图片',
    font: '字体',
    showSocial: '显示社交媒体',
    uploadBackground: '上传背景',
    switchToLandscape: '切换横版',
    switchToPortrait: '切换竖版',
    saveImage: '保存图片',
    themes: {
      modern: '现代',  
      vintage: '古典',  
      trendy: '时尚',
      minimal: '简约',
      bold: '大胆',
      custom: '自定义',
    },
    backgroundImageUrl: '背景图片链接',
    edit: '编辑',
    switchLayout: '切换版式',
    horizontal: '横版',
    vertical: '竖版',
  }
}

export function WysiwygBusinessCard() {
  const [cardInfo, setCardInfo] = useState<CardInfo>(initialCardInfo)
  const [editingField, setEditingField] = useState<keyof CardInfo | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [language, setLanguage] = useState<'en' | 'zh'>('en')

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'zh' : 'en')
  const t = translations[language]

  useEffect(() => {
    fonts.forEach(font => {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    })
  }, [])

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingField])

  const handleInputChange = (field: keyof CardInfo, value: string | number | boolean) => {
    setCardInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialMediaChange = (platform: string, username: string) => {
    setCardInfo(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map(sm => 
        sm.platform === platform ? { ...sm, username } : sm
      )
    }))
  }

  const handleThemeChange = (theme: CardTheme) => {
    if (theme === 'custom') {
      setCardInfo(prev => ({
        ...prev,
        theme,
        backgroundColor: '#f0f0f0',
        textColor: '#333333',
        borderWidth: 2,
        borderColor: '#666666',
        backgroundImageUrl: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzFxMGJwd2lwaDhqcXFxZmNjaXVjZjk4ZjNzdnJma3k4ZmxocXJtZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S8ZM7uiGCJVv25rrhc/giphy.gif',
      }))
    } else {
      setCardInfo(prev => ({ 
        ...initialCardInfo, // 重置为初始状态
        theme,
        backgroundColor: '', // 清空自定义背景色
        textColor: '', // 清空自定义文字颜色
        borderWidth: 0, // 重置边框宽度
        borderColor: '', // 清空边框颜色
        backgroundImageUrl: '', // 清空背景图片
        font: themeStyles[theme].font.split('-')[1] || 'Inter',
        // 保留用户的个人信息和社交媒体设置
        name: prev.name,
        position: prev.position,
        company: prev.company,
        email: prev.email,
        phone: prev.phone,
        showSocial: prev.showSocial,
        socialMedia: prev.socialMedia,
        orientation: prev.orientation,
      }))
    }
  }

  const handleEditClick = (field: keyof CardInfo) => {
    setEditingField(field)
  }

  const handleInputBlur = () => {
    setEditingField(null)
  }

  const handleSaveImage = () => {
    const cardElement = document.getElementById('business-card')
    if (cardElement) {
      html2canvas(cardElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = imgData
        link.download = 'business-card.png'
        link.click()
      })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCardInfo(prev => ({ ...prev, imageUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleImageDelete = () => {
    setCardInfo(prev => ({ ...prev, imageUrl: '/default-avatar.png' }))
  }

  const toggleOrientation = () => {
    setCardInfo(prev => ({
      ...prev,
      orientation: prev.orientation === 'landscape' ? 'portrait' : 'landscape'
    }))
  }

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCardInfo(prev => ({ ...prev, backgroundImageUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerBackgroundImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        handleBackgroundImageUpload(event as unknown as React.ChangeEvent<HTMLInputElement>)
      }
    }
    input.click()
  }

  const handleBackgroundImageDelete = () => {
    setCardInfo(prev => ({ ...prev, backgroundImageUrl: '' }))
  }

  const cardStyle = {
    width: cardInfo.orientation === 'landscape' ? '90vw' : '54vw',
    maxWidth: cardInfo.orientation === 'landscape' ? '450px' : '270px',
    aspectRatio: cardInfo.showSocial ? 'auto' : (cardInfo.orientation === 'landscape' ? '90 / 54' : '54 / 90'),
    ...(cardInfo.theme === 'custom' && {
      backgroundColor: cardInfo.backgroundColor,
      color: cardInfo.textColor,
      borderWidth: `${cardInfo.borderWidth}px`,
      borderColor: cardInfo.borderColor,
      borderStyle: cardInfo.borderWidth > 0 ? 'solid' : 'none',
      backgroundImage: cardInfo.backgroundImageUrl ? `url(${cardInfo.backgroundImageUrl})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }),
    fontFamily: cardInfo.font,
  }

  const renderEditableField = (field: keyof CardInfo) => (
    <div className="relative group">
      {editingField === field ? (
        <Input
          ref={inputRef}
          value={cardInfo[field] as string}
          onChange={(e) => handleInputChange(field, e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleInputBlur();
            }
          }}
          className="w-full"
        />
      ) : (
        <div className="flex items-center justify-between">
          <span>{typeof cardInfo[field] === 'object' ? JSON.stringify(cardInfo[field]) : cardInfo[field]}</span>
          <Button
            variant="ghost"
            size="sm"
            className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleEditClick(field)}
          >
            <Edit fontSize="small" />
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className="pt-16">
      <Card className="w-full max-w-3xl mx-auto bg-card text-card-foreground shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <CardTitle className="font-bold">{t.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              <Language className="mr-2 h-4 w-4" />
              {language === 'en' ? '中文' : 'English'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mt-8">
            <div 
              id="business-card"
              className={`p-6 pr-14 rounded-lg shadow-lg ${cardInfo.theme !== 'custom' ? themeStyles[cardInfo.theme].bg : ''} ${cardInfo.theme !== 'custom' ? themeStyles[cardInfo.theme].text : ''} transition-all duration-300 overflow-hidden flex items-center justify-center`}
              style={cardStyle}
            >
              <div className={`flex ${cardInfo.orientation === 'landscape' ? 'flex-row items-center' : 'flex-col items-start'} justify-center w-full h-full`}>
                <div className={`flex ${cardInfo.orientation === 'landscape' ? 'flex-row items-center' : 'flex-col items-start'} ${cardInfo.orientation === 'landscape' ? 'space-x-6' : 'space-y-6'} w-full`}>
                  <div className="flex-shrink-0 relative group">
                    <div className="relative">
                      <Image
                        src={cardInfo.imageUrl || '/default-avatar.png'}
                        alt="个人头像或公司logo"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      {cardInfo.imageUrl !== '/default-avatar.png' && (
                        <button
                          onClick={handleImageDelete}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="删除图片"
                        >
                          <Close fontSize="small" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={triggerImageUpload}
                      className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="更换图片"
                    >
                      <Edit fontSize="small" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <div className={`flex flex-col ${cardInfo.orientation === 'portrait' ? 'text-left w-full' : ''}`}>
                    <h2 className="text-2xl font-bold">{renderEditableField('name')}</h2>
                    <p className="text-lg">{renderEditableField('position')}</p>
                    <p>{renderEditableField('company')}</p>
                    <p>{renderEditableField('email')}</p>
                    <p>{renderEditableField('phone')}</p>
                  </div>
                </div>
                {cardInfo.showSocial && (
                  <div className={`mt-4 pt-4 border-t border-opacity-20 ${cardInfo.orientation === 'portrait' ? 'w-full' : ''}`}>
                    <div className={`flex flex-wrap gap-2 ${cardInfo.orientation === 'portrait' ? 'justify-start' : 'justify-center'}`}>
                      {cardInfo.socialMedia.map((sm) => 
                        sm.username && (
                          <a 
                            key={sm.platform} 
                            href={`https://${sm.platform}.com/${sm.username}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center space-x-1 px-2 py-1 rounded border border-current text-current`}
                          >
                            {sm.icon}
                            <span>{sm.username}</span>
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <Button onClick={toggleOrientation} className="flex items-center">
                <RotateRight className="mr-2" />
                {cardInfo.orientation === 'landscape' ? `${t.switchLayout}: ${t.vertical}` : `${t.switchLayout}: ${t.horizontal}`}
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <Label className="font-bold">{t.theme}</Label>
              <RadioGroup value={cardInfo.theme} onValueChange={handleThemeChange} className="flex flex-wrap gap-4 mt-2">
                {Object.keys(themeStyles).map((theme) => (
                  <div key={theme} className="flex items-center space-x-2">
                    <RadioGroupItem value={theme} id={theme} />
                    <Label htmlFor={theme} className="capitalize font-bold">{t.themes[theme as keyof typeof t.themes]}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            {cardInfo.theme === 'custom' && (
              <>
                <div>
                  <Label htmlFor="backgroundColor" className="font-bold">{t.backgroundColor}</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={cardInfo.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      className="w-10 h-10 p-1 rounded"
                    />
                    <span className="ml-2">{cardInfo.backgroundColor}</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="textColor" className="font-bold">{t.textColor}</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={cardInfo.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      className="w-10 h-10 p-1 rounded"
                    />
                    <span className="ml-2">{cardInfo.textColor}</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="borderWidth" className="font-bold">{t.borderWidth}</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      id="borderWidth"
                      type="number"
                      min="0"
                      max="10"
                      value={cardInfo.borderWidth}
                      onChange={(e) => handleInputChange('borderWidth', parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="ml-2">px</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="borderColor" className="font-bold">{t.borderColor}</Label>
                  <div className="flex items-center mt-2">
                    <Input
                      id="borderColor"
                      type="color"
                      value={cardInfo.borderColor}
                      onChange={(e) => handleInputChange('borderColor', e.target.value)}
                      className="w-10 h-10 p-1 rounded"
                    />
                    <span className="ml-2">{cardInfo.borderColor}</span>
                  </div>
                </div>
                <div>
                  <Label className="font-bold">{t.backgroundImage}</Label>
                  <div className="flex items-center mt-2">
                    {cardInfo.backgroundImageUrl ? (
                      <div className="relative">
                        <Image
                          src={cardInfo.backgroundImageUrl}
                          alt="背景"
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded"
                          unoptimized
                        />
                        <button
                          onClick={handleBackgroundImageDelete}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          aria-label="删除背景图片"
                        >
                          <Close fontSize="small" />
                        </button>
                      </div>
                    ) : (
                      <Button onClick={triggerBackgroundImageUpload}>
                        <AddPhotoAlternate className="mr-2" />
                        {t.uploadBackground}
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="backgroundImageUrl" className="font-bold">{t.backgroundImageUrl}</Label>
                  <Input
                    id="backgroundImageUrl"
                    value={cardInfo.backgroundImageUrl}
                    onChange={(e) => handleInputChange('backgroundImageUrl', e.target.value)}
                    placeholder={t.backgroundImageUrl}
                    className="mt-2"
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="font" className="font-bold">{t.font}</Label>
              <Select value={cardInfo.font} onValueChange={(value) => handleInputChange('font', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent className="bg-popover/80 text-popover-foreground shadow-md z-50 select-content" sideOffset={5}>
                  {fonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showSocial"
                  checked={cardInfo.showSocial}
                  onCheckedChange={(checked) => handleInputChange('showSocial', checked)}
                />
                <Label htmlFor="showSocial" className="text-sm font-bold leading-none">
                  {t.showSocial}
                </Label>
              </div>
              {cardInfo.showSocial && (
                <div className="mt-2 space-y-2">
                  {cardInfo.socialMedia.map((sm) => (
                    <div key={sm.platform} className="flex items-center space-x-2">
                      {sm.icon}
                      <Input
                        placeholder={`${sm.platform} username`}
                        value={sm.username}
                        onChange={(e) => handleSocialMediaChange(sm.platform, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button onClick={handleSaveImage}>
            <Download fontSize="small" className="mr-2" />
            {t.saveImage}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}