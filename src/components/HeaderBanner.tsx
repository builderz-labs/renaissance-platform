import { motion } from 'framer-motion'

function HeaderBanner() {
    return (
        <motion.div className='mt-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <img src="/img/banner.webp" alt="Header Banner" className='w-full' />
        </motion.div>
    )
}

export default HeaderBanner